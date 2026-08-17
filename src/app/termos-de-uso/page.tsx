import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { getPublicData } from "@/lib/data";

export const metadata: Metadata = { title: "Termos de Uso" };

export default async function Page() {
  const { settings } = await getPublicData();
  if (settings.terms_of_use) return <LegalPage title="Termos de Uso"><p className="whitespace-pre-wrap">{settings.terms_of_use}</p></LegalPage>;
  return <LegalPage title="Termos de Uso"><p><strong>Minuta para validação jurídica.</strong> O conteúdo é institucional e comercial, dirigido prioritariamente a médicos externos. Não substitui avaliação, orientação ou documentação médica.</p><h2>Conteúdo</h2><p>Informações operacionais, condições comerciais e escopos de serviço somente são confirmados pelos canais oficiais do Axis. Fotografias retratam a estrutura fornecida pela instituição, sem constituir promessa sobre equipamentos ou disponibilidade.</p><h2>Uso adequado</h2><p>É proibido tentar acessar áreas restritas, interferir no funcionamento da aplicação ou enviar conteúdo malicioso pelos formulários.</p></LegalPage>;
}
