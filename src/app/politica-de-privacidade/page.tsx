import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { getPublicData } from "@/lib/data";

export const metadata: Metadata = { title: "Política de Privacidade", robots: { index: true, follow: true } };

export default async function Page() {
  const { settings } = await getPublicData();
  if (settings.privacy_policy) return <LegalPage title="Política de Privacidade"><p className="whitespace-pre-wrap">{settings.privacy_policy}</p></LegalPage>;
  return <LegalPage title="Política de Privacidade"><p><strong>Minuta para validação jurídica.</strong> Este texto inicial descreve o tratamento de dados do formulário comercial e deve ser revisado por assessoria especializada antes da publicação definitiva.</p><h2>Dados coletados</h2><p>O formulário pode coletar nome, sobrenome, CRM, estado, especialidade, telefone, e-mail, mensagem, origem da visita e parâmetros UTM informados pelo navegador.</p><h2>Finalidade</h2><p>Os dados são utilizados para responder à solicitação comercial do titular, organizar o atendimento e medir a origem dos contatos, conforme as preferências de consentimento.</p><h2>Direitos do titular</h2><p>Solicitações de acesso, correção, eliminação ou esclarecimentos deverão ser direcionadas ao canal de privacidade a ser cadastrado pela administração do Axis.</p><h2>Cookies</h2><p>Cookies necessários são usados para o funcionamento do site. Analytics e marketing permanecem desativados até consentimento, quando aplicável.</p></LegalPage>;
}
