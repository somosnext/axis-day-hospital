import { AdminHeader } from "@/components/admin/page-header";
import { ContentManager } from "@/components/admin/content-manager";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Page() {
  const { data } = await (await createSupabaseServerClient()).from("page_sections").select("*").order("sort_order");
  return <>
    <AdminHeader eyebrow="CMS" title="Conteúdo" description="Headlines, textos, CTAs e etapas institucionais. O conteúdo avançado aceita JSON validado." />
    <ContentManager resource="page_sections" initial={data || []} fields={[
      { key: "section_key", label: "Chave" },
      { key: "eyebrow", label: "Label" },
      { key: "title", label: "Título" },
      { key: "description", label: "Descrição", type: "textarea" },
      { key: "content", label: "Conteúdo avançado (JSON)", type: "json" },
      { key: "cta_label", label: "Texto do CTA" },
      { key: "cta_url", label: "URL do CTA" },
      { key: "sort_order", label: "Ordem", type: "number" },
      { key: "active", label: "Ativo", type: "boolean" },
    ]} />
  </>;
}
