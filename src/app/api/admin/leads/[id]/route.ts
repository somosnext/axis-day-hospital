import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ status: z.enum(["new", "contacted", "qualified", "converted", "lost"]).optional(), notes: z.string().max(5000).nullable().optional() });

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getStaff()) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "ID inválido" }, { status: 422 });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("audit_logs").select("id,action,metadata,created_at").eq("entity", "leads").eq("entity_id", id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Falha ao carregar histórico" }, { status: 500 });
  return NextResponse.json({ history: data || [] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaff();
  if (!staff) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "ID inválido" }, { status: 422 });
  const supabase = await createSupabaseServerClient();
  const { data: before } = await supabase.from("leads").select("status,notes").eq("id", id).single();
  const { data, error } = await supabase.from("leads").update(parsed.data).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 500 });
  await supabase.from("audit_logs").insert({ user_id: staff.id, action: "update", entity: "leads", entity_id: id, metadata: { before, after: parsed.data } });
  return NextResponse.json({ lead: data });
}
