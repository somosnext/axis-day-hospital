import Image from "next/image";
import type { EquipmentItem } from "@/config/site";
import { Container, Eyebrow } from "@/components/ui/primitives";

export function EquipmentShowcase({ items }: { items: EquipmentItem[] }) {
  return (
    <section id="equipamentos" className="section-pad bg-navy-950 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><Eyebrow className="text-white/60">Equipamentos</Eyebrow><h2 className="mt-6 text-section balance">Tecnologia para cada etapa do procedimento.</h2></div>
          <p className="max-w-xl leading-7 text-white/70">Conheça os equipamentos apresentados ao Axis para apoiar procedimentos de lipoaspiração, retração da pele, contorno e cirurgia. As descrições abaixo foram organizadas a partir do material fornecido.</p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => <article key={item.name} className="overflow-hidden border border-white/15 bg-white/5"><div className="relative aspect-[4/3] bg-white"><Image src={item.image} alt={`${item.name} — imagem representativa do equipamento`} fill sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw" className="object-contain p-4" /></div><div className="p-6"><div className="flex gap-4"><span className="font-editorial text-2xl text-white/35">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-white/50">{item.category}</p><h3 className="mt-2 font-editorial text-3xl">{item.name}</h3><p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p><p className="mt-4 text-[10px] uppercase tracking-[.12em] text-white/35">Fonte da imagem: {item.source}</p></div></div></div></article>)}
        </div>
        <p className="mt-8 text-xs leading-5 text-white/45">Disponibilidade, indicação, condições de uso e suporte técnico devem ser confirmados diretamente com a equipe Axis.</p>
      </Container>
    </section>
  );
}
