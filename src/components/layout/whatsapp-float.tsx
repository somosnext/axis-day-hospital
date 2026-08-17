"use client";

import{MessageCircle}from"lucide-react";import{track}from"@/components/analytics/analytics";
export function WhatsAppFloat({href}:{href:string}){return <a href={href} target="_blank" rel="noopener noreferrer" onClick={()=>track("whatsapp_click",{placement:"floating"})} className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center border border-white/20 bg-navy text-white shadow-xl transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy md:bottom-7 md:right-7" aria-label="Falar com o Axis pelo WhatsApp"><MessageCircle size={21}/></a>}
