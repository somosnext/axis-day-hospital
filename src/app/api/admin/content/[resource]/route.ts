import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowed = ["page_sections", "differentials", "gallery", "faqs"] as const;
type Resource = (typeof allowed)[number];

const schemas = {
  page_sections: z.object({ section_key: z.string().trim().min(1).max(80), eyebrow: z.string().trim().max(160).nullable().optional(), title: z.string().trim().max(240).nullable().optional(), description: z.string().trim().max(4000).nullable().optional(), content: z.record(z.string(), z.unknown()).nullable().optional(), cta_label: z.string().trim().max(120).nullable().optional(), cta_url: z.string().trim().max(500).nullable().optional(), active: z.boolean().optional(), sort_order: z.number().int().min(0).max(10000).optional() }),
  differentials: z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().max(2000).nullable().optional(), icon: z.string().trim().max(80).nullable().optional(), image_url: z.string().trim().max(1000).nullable().optional(), active: z.boolean().optional(), sort_order: z.number().int().min(0).max(10000).optional() }),
  gallery: z.object({ title: z.string().trim().max(160).nullable().optional(), alt_text: z.string().trim().min(1).max(300), image_url: z.string().trim().min(1).max(1000), category: z.string().trim().max(100).nullable().optional(), active: z.boolean().optional(), sort_order: z.number().int().min(0).max(10000).optional() }),
  faqs: z.object({ question: z.string().trim().min(1).max(300), answer: z.string().trim().min(1).max(5000), active: z.boolean().optional(), sort_order: z.number().int().min(0).max(10000).optional() }),
} satisfies Record<Resource, z.ZodType>;

function isResource(value: string): value is Resource { return allowed.includes(value as Resource); }
function normalize(body: Record<string, unknown>) { return Object.fromEntries(Object.entries(body).filter(([key]) => key !== "id").map(([key, value]) => [key, value === "" ? null : value])); }

function parsePayload(resource: Resource, body: Record<string, unknown>) {
  const normalized = normalize(body);
  if (resource === "page_sections" && typeof normalized.content === "string") {
    try { normalized.content = normalized.content.trim() ? JSON.parse(normalized.content) : null; }
    catch { return { error: "O conteúdo JSON não é válido." } as const; }
  }
  const result = schemas[resource].safeParse(normalized);
  return result.success ? { data: result.data } as const : { error: result.error.issues[0]?.message ?? "Dados inválidos." } as const;
}

async function getContext(resource: string) {
  const staff = await getStaff();
  if (!staff) return { error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  if (!isResource(resource)) return { error: NextResponse.json({ error: "Recurso inválido" }, { status: 404 }) };
  return { staff, resource, supabase: await createSupabaseServerClient() };
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const context = await getContext(resource);
  if ("error" in context) return context.error;
  const parsed = parsePayload(context.resource, await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });
  // The runtime schema is selected from the same resource discriminant above.
  // Supabase cannot preserve that correlation across a dynamic table union.
  const { data, error } = await context.supabase.from(context.resource).insert(parsed.data as never).select("*").single();
  if (error) return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 });
  await context.supabase.from("audit_logs").insert({ user_id: context.staff.id, action: "create", entity: context.resource, entity_id: data.id, metadata: parsed.data });
  revalidatePath("/");
  return NextResponse.json({ row: data }, { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const context = await getContext(resource);
  if ("error" in context) return context.error;
  const body = await request.json() as Record<string, unknown>;
  const id = z.string().uuid().safeParse(body.id);
  if (!id.success) return NextResponse.json({ error: "ID inválido" }, { status: 422 });
  const parsed = parsePayload(context.resource, body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });
  const { data, error } = await context.supabase.from(context.resource).update(parsed.data).eq("id", id.data).select("*").single();
  if (error) return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 });
  await context.supabase.from("audit_logs").insert({ user_id: context.staff.id, action: "update", entity: context.resource, entity_id: id.data, metadata: parsed.data });
  revalidatePath("/");
  return NextResponse.json({ row: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const context = await getContext(resource);
  if ("error" in context) return context.error;
  const id = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!id.success) return NextResponse.json({ error: "ID inválido" }, { status: 422 });
  let storagePath: string | null = null;
  if (context.resource === "gallery") {
    const { data } = await context.supabase.from("gallery").select("image_url").eq("id", id.data).maybeSingle();
    const marker = "/storage/v1/object/public/site-assets/";
    if (data?.image_url?.includes(marker)) storagePath = decodeURIComponent(data.image_url.split(marker)[1]);
  }
  const { error } = await context.supabase.from(context.resource).delete().eq("id", id.data);
  if (error) return NextResponse.json({ error: "Falha ao excluir" }, { status: 500 });
  if (storagePath) await context.supabase.storage.from("site-assets").remove([storagePath]);
  await context.supabase.from("audit_logs").insert({ user_id: context.staff.id, action: "delete", entity: context.resource, entity_id: id.data, metadata: storagePath ? { storage_path: storagePath } : {} });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
