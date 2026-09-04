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
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {["/images/equipamentos-axis-01.jpg", "/images/equipamentos-axis-02.jpg"].map((src, index) => <figure key={src} className="overflow-hidden border border-white/10 bg-white/5"><div className="relative aspect-[4/3]"><Image src={src} alt={`Material visual fornecido sobre equipamentos Axis — imagem ${index + 1}`} fill sizes="(min-width:768px) 50vw,100vw" className="object-cover" /></div><figcaption className="px-4 py-3 text-xs uppercase tracking-[.12em] text-white/55">Material visual fornecido · Equipamentos Axis</figcaption></figure>)}
        </div>
        <div className="mt-16 grid gap-x-10 border-y border-white/15 md:grid-cols-2">
          {items.map((item, index) => <article key={item.name} className="border-b border-white/15 py-7 last:border-b-0 md:nth-[odd]:border-r md:nth-[odd]:pr-10 md:nth-[even]:pl-10"><div className="flex gap-5"><span className="font-editorial text-3xl text-white/35">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/50">{item.category}</p><h3 className="mt-2 font-editorial text-3xl">{item.name}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-white/70">{item.description}</p></div></div></article>)}
        </div>
        <p className="mt-8 text-xs leading-5 text-white/45">Disponibilidade, indicação, condições de uso e suporte técnico devem ser confirmados diretamente com a equipe Axis.</p>
      </Container>
    </section>
  );
}
