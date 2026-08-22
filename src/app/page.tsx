import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Clock3, MapPin } from "lucide-react";
import { Analytics } from "@/components/analytics/analytics";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ContactForm } from "@/components/forms/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { CookieBanner } from "@/components/privacy/cookie-banner";
import { Gallery } from "@/components/sections/gallery";
import { HeroVideo } from "@/components/sections/hero-video";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getPublicData } from "@/lib/data";

export const revalidate = 60;

function getSafeGoogleMapsEmbed(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.google.com" && url.pathname.startsWith("/maps") ? value : null;
  } catch {
    return null;
  }
}

type SectionItem = { title: string; description: string };

function getSectionItems(content: Record<string, unknown> | null | undefined, fallback: SectionItem[]) {
  if (!Array.isArray(content?.items)) return fallback;
  const items = content.items.filter((item): item is SectionItem => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate.title === "string" && typeof candidate.description === "string";
  });
  return items.length ? items : fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();
  const title = settings.seo_title || "Axis Day Hospital | Estrutura cirúrgica para médicos em São Paulo";
  const description = settings.seo_description || "Hospital para procedimentos invasivos de curta permanência em São Paulo, com estrutura moderna para pacientes, médicos e equipes.";
  return {
    title,
    description,
    alternates: settings.canonical_url ? { canonical: settings.canonical_url } : undefined,
    openGraph: { title, description, type: "website", images: [{ url: "/images/RCZ_2199-HDR.jpg", alt: "Ambiente cirúrgico do Axis Day Hospital" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/RCZ_2199-HDR.jpg"] },
  };
}

export default async function Home() {
  const { settings, gallery, differentials, faqs, sections } = await getPublicData();
  const hero = sections.hero;
  const positioning = sections.positioning;
  const physicians = sections.physicians;
  const process = sections.process;
  const experience = sections.experience;
  const education = sections.education;
  const structure = sections.structure;
  const editorialCta = sections.editorial_cta;
  const whatsapp = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsapp_message || "Olá. Sou médico(a) e gostaria de conhecer as condições para realizar procedimentos no Axis Day Hospital.")}`
    : null;
  const processSteps = Array.isArray(process?.content?.steps)
    ? process.content.steps.filter((step): step is string => typeof step === "string").slice(0, 4)
    : ["Fale com o Axis", "Conte sua necessidade", "Conheça a estrutura e as condições", "Inicie seu credenciamento"];
  const experienceItems = getSectionItems(experience?.content, [
    {
      title: "Antes do procedimento",
      description: "Espaços que podem receber consultas pré-operatórias, avaliações anestésicas e outros atendimentos relacionados ao procedimento.",
    },
    {
      title: "Após o procedimento",
      description: "Uma sala de recuperação cuidadosamente monitorizada, com a assistência necessária para uma recuperação segura e confortável.",
    },
  ]);
  const safeMapsEmbed = getSafeGoogleMapsEmbed(settings.maps_embed);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.business_name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenida Rubem Berta, 850 — Conjunto 1404",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    openingHours: "Mo-Fr 07:00-19:00",
  };

  return (
    <>
      <Header />
      <main>
        <section id="inicio" className="relative min-h-[94svh] overflow-hidden bg-navy-950 text-white">
          <Image src="/images/RCZ_2199-HDR.jpg" alt="Ambiente cirúrgico do Axis Day Hospital" fill priority loading="eager" sizes="100vw" className="object-cover object-center" />
          <HeroVideo />
          <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(7,29,44,.94)_0%,rgba(7,29,44,.68)_48%,rgba(7,29,44,.18)_100%)]" />
          <Container className="relative z-[3] flex min-h-[94svh] items-end pb-20 pt-36 md:items-center md:pb-0">
            <div className="max-w-5xl">
              <p className="eyebrow mb-6 text-white/70">{hero?.eyebrow || "Day Hospital · São Paulo"}</p>
              <h1 className="text-display balance max-w-4xl">{hero?.title || <>Sua cirurgia.<br />Nossa estrutura.</>}</h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 md:text-lg">{hero?.description || "Um Day Hospital para procedimentos de curta permanência, onde tecnologia, acolhimento e segurança caminham juntos."}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={hero?.cta_url || "#o-axis"} variant="light">{hero?.cta_label || "Conheça o Axis"}</Button>
                <Button href="#contato" variant="outline">Falar com nossa equipe <ArrowRight size={16} /></Button>
              </div>
            </div>
          </Container>
          <a href="#o-axis" className="absolute bottom-6 right-6 z-[3] hidden items-center gap-3 text-[10px] uppercase tracking-[.2em] text-white/55 md:flex">Explore <ArrowDown size={16} /></a>
        </section>

        <section id="o-axis" className="section-pad">
          <Container>
            <Reveal>
              <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
                <Eyebrow>{positioning?.eyebrow || "Axis Day Hospital"}</Eyebrow>
                <div>
                  <h2 className="text-section balance text-navy">{positioning?.title || "O cuidado começa antes da cirurgia."}</h2>
                  <p className="mt-8 max-w-3xl text-lg leading-8 text-ink/70">{positioning?.description || "O Axis é especializado em procedimentos invasivos de curta permanência. Cada ambiente foi planejado para oferecer conforto aos pacientes e praticidade às equipes médicas, favorecendo um atendimento organizado, eficiente e humanizado."}</p>
                </div>
              </div>
            </Reveal>
            <div className="mt-20 grid border-y hairline md:grid-cols-3">
              {differentials.slice(0, 3).map((differential, index) => (
                <article key={differential.title} className="border-b hairline py-10 md:border-b-0 md:border-r md:px-8 first:pl-0 last:border-r-0">
                  <span className="font-editorial text-5xl text-navy/25">0{index + 1}</span>
                  <h3 className="mt-8 font-editorial text-4xl text-navy">{differential.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">{differential.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="overflow-hidden bg-off-white">
          <div className="grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[32rem] lg:min-h-[48rem]"><Image src="/images/RCZ_2309.jpg" alt="Ambiente de recepção e convivência do Axis Day Hospital" fill sizes="(min-width:1024px) 53vw,100vw" className="object-cover" /></div>
            <div className="flex items-center px-6 py-20 sm:px-12 lg:px-[7vw]">
              <Reveal>
                <Eyebrow>{experience?.eyebrow || "Experiência Axis"}</Eyebrow>
                <h2 className="mt-6 text-section balance text-navy">{experience?.title || "Uma jornada preparada em cada etapa."}</h2>
                <p className="mt-6 max-w-xl leading-7 text-ink/65">{experience?.description || "Para pacientes que necessitam de procedimentos cirúrgicos de curta permanência e para médicos que buscam uma estrutura moderna, segura e organizada para realizá-los."}</p>
                <div className="mt-10 divide-y hairline">
                  {experienceItems.map((item) => (
                    <div key={item.title} className="py-6 first:pt-0">
                      <h3 className="font-editorial text-3xl text-navy">{item.title}</h3>
                      <p className="mt-3 leading-7 text-ink/65">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="para-medicos" className="bg-navy text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[34rem]"><Image src="/images/RCZ_2303.jpg" alt="Recepção do Axis Day Hospital" fill sizes="(min-width:1024px) 50vw,100vw" className="object-cover" /></div>
            <div className="flex items-center px-6 py-20 sm:px-12 lg:px-[8vw]">
              <div>
                <p className="eyebrow text-white/60">{physicians?.eyebrow || "De médico para médico"}</p>
                <h2 className="mt-6 text-section balance">{physicians?.title || "Prontos para cuidar do seu paciente junto com você."}</h2>
                <p className="mt-7 font-editorial text-3xl text-white/95">Sua equipe encontra um ambiente preparado.</p>
                <p className="mt-5 max-w-xl leading-7 text-white/70">{physicians?.description || "O Axis recebe médicos e suas equipes em uma estrutura organizada para apoiar o procedimento, com espaços planejados para o cuidado e o atendimento aos pacientes."}</p>
                <Button href={physicians?.cta_url || "#contato"} variant="light" className="mt-9">{physicians?.cta_label || "Fale conosco e faça seu credenciamento"}</Button>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section-pad bg-white">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2">
              <div><Eyebrow>{process?.eyebrow || "Como funciona"}</Eyebrow><h2 className="mt-6 text-section text-navy">{process?.title || "Uma conversa clara, do primeiro contato à organização."}</h2></div>
              <p className="max-w-xl self-end text-sm leading-7 text-ink/60">{process?.description || "Nossa equipe entende a necessidade do médico, apresenta a estrutura e as condições e orienta os primeiros passos do credenciamento."}</p>
            </div>
            <ol className="mt-16 grid md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => <li key={step} className="border-t hairline py-8 pr-8"><span className="eyebrow text-metal">0{index + 1}</span><h3 className="mt-10 font-editorial text-3xl text-navy">{step}</h3></li>)}
            </ol>
          </Container>
        </section>

        <section id="estrutura" className="section-pad bg-off-white">
          <Container>
            <div className="mb-14 grid gap-8 md:grid-cols-2">
              <div><Eyebrow>{structure?.eyebrow || "Conheça o Axis"}</Eyebrow><h2 className="mt-6 text-section text-navy">{structure?.title || "Estrutura pensada nos detalhes."}</h2></div>
              <p className="max-w-lg self-end text-sm leading-7 text-ink/60">{structure?.description || "Ambientes e salas cirúrgicas preparados com infraestrutura e equipamentos para integrar segurança, tecnologia e acolhimento durante a experiência de médicos, equipes e pacientes."}</p>
            </div>
            <Gallery items={gallery} />
          </Container>
        </section>

        <section className="section-pad bg-white">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
              <Reveal>
                <Eyebrow>{education?.eyebrow || "Educação e atualização"}</Eyebrow>
                <h2 className="mt-6 text-section balance text-navy">{education?.title || "Tecnologia a serviço do cuidado e do ensino."}</h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-ink/68">{education?.description || "Uma câmera 4K integrada ao foco cirúrgico permite filmar e transmitir procedimentos ao vivo em alta definição. O recurso amplia as possibilidades de aulas, treinamentos e cursos para atualização profissional e troca de conhecimento."}</p>
              </Reveal>
              <div className="relative min-h-[30rem] overflow-hidden bg-navy"><Image src="/images/RCZ_2222.jpg" alt="Ambiente cirúrgico do Axis Day Hospital preparado para atividades de educação médica" fill sizes="(min-width:1024px) 55vw,100vw" className="object-cover" /></div>
            </div>
          </Container>
        </section>

        <section className="relative min-h-[70svh] overflow-hidden bg-navy-950 text-white">
          <Image src="/images/RCZ_2222.jpg" alt="Ambiente cirúrgico com iluminação azul no Axis Day Hospital" fill sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-navy-950/50" />
          <Container className="relative flex min-h-[70svh] items-center">
            <div className="max-w-4xl">
              <p className="eyebrow text-white/60">{editorialCta?.eyebrow || "Próximo passo"}</p>
              <h2 className="mt-6 text-display balance">{editorialCta?.title || "Tecnologia que inspira confiança. Cuidado que faz a diferença."}</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">{editorialCta?.description || "Conheça uma estrutura preparada para receber você, sua equipe e seus pacientes — antes, durante e após o procedimento."}</p>
              <Button href={editorialCta?.cta_url || "#contato"} variant="light" className="mt-9">{editorialCta?.cta_label || "Fale conosco e faça seu credenciamento"}</Button>
            </div>
          </Container>
        </section>

        <section id="localizacao" className="section-pad bg-white">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <Eyebrow>Localização</Eyebrow><h2 className="mt-6 text-section text-navy">Axis Day Hospital</h2>
                <p className="mt-7 max-w-lg text-lg leading-8 text-ink/68">Em Indianápolis, o Axis está em uma região com acesso ao Parque Ibirapuera, a conexões aeroportuárias e a opções de hospedagem, trazendo mais praticidade para médicos, pacientes e acompanhantes.</p>
                <div className="mt-10 grid gap-6 text-sm leading-7">
                  <div className="flex gap-4"><MapPin className="mt-1 shrink-0 text-navy" /><p>{settings.address}</p></div>
                  <div className="flex gap-4"><Clock3 className="mt-1 shrink-0 text-navy" /><p>{settings.opening_hours}</p></div>
                </div>
                {settings.maps_url ? <TrackedLink href={settings.maps_url} event="maps_click" className="mt-9 inline-flex min-h-12 items-center justify-center border border-navy bg-navy px-6 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-navy-950">Como chegar</TrackedLink> : <p className="mt-9 text-xs text-ink/45">Link de rota aguardando configuração no painel.</p>}
              </div>
              <div className="relative min-h-[28rem] overflow-hidden bg-navy">
                {safeMapsEmbed ? <iframe title="Mapa do Axis Day Hospital" src={safeMapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" allowFullScreen /> : <Image src="/images/RCZ_2318-HDR.jpg" alt="Ambiente interno do Axis Day Hospital" fill className="object-cover" sizes="(min-width:1024px) 50vw,100vw" />}
              </div>
            </div>
          </Container>
        </section>

        <section id="contato" className="section-pad border-t hairline">
          <Container>
            <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <Eyebrow>Contato comercial</Eyebrow><h2 className="mt-6 text-section text-navy">Fale conosco e faça seu credenciamento.</h2>
                <p className="mt-7 max-w-md leading-7 text-ink/65">Conte sua necessidade para nossa equipe. CRM, estado e especialidade ajudam a personalizar o atendimento, mas são opcionais nesta primeira conversa.</p>
                {whatsapp && <TrackedLink href={whatsapp} event="whatsapp_click" label="contact_section" className="mt-8 inline-flex min-h-12 items-center justify-center border border-navy px-6 text-xs font-bold uppercase tracking-[.12em] text-navy transition hover:bg-navy/5">Falar pelo WhatsApp</TrackedLink>}
              </div>
              <ContactForm />
            </div>
          </Container>
        </section>

        {faqs.length > 0 && <section className="section-pad bg-white"><Container><Eyebrow>Perguntas frequentes</Eyebrow><div className="mt-10 divide-y hairline">{faqs.map((faq) => <details key={faq.id} className="py-6"><summary className="cursor-pointer font-editorial text-2xl text-navy">{faq.question}</summary><p className="mt-4 max-w-3xl leading-7 text-ink/65">{faq.answer}</p></details>)}</div></Container></section>}
      </main>
      <Footer settings={settings} />
      <CookieBanner />
      <Analytics />
      {whatsapp && <WhatsAppFloat href={whatsapp} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
