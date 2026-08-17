"use client";

import { useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import type { Lead, LeadStatus } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Badge, inputClass } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];
const perPage = 25;
type History = { id: string; action: string; metadata: { before?: Partial<Lead>; after?: Partial<Lead> } | null; created_at: string };

export function LeadsManager({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Lead | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => leads.filter((lead) => (!filter || lead.status === filter) && `${lead.first_name} ${lead.last_name} ${lead.crm} ${lead.email} ${lead.phone}`.toLowerCase().includes(query.toLowerCase())), [leads, query, filter]);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice((Math.min(page, pages) - 1) * perPage, Math.min(page, pages) * perPage);

  async function openLead(lead: Lead) {
    setActive(lead);
    setHistory([]);
    const response = await fetch(`/api/admin/leads/${lead.id}`);
    if (response.ok) setHistory((await response.json()).history);
  }

  async function update(id: string, patch: Partial<Lead>) {
    setBusy(true);
    const response = await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (response.ok) {
      const { lead } = await response.json();
      setLeads((current) => current.map((item) => item.id === id ? lead : item));
      await openLead(lead);
    }
    setBusy(false);
  }

  function exportCsv() {
    const columns = ["first_name", "last_name", "crm", "crm_state", "specialty", "phone", "email", "source", "utm_source", "utm_campaign", "status", "created_at"] as const;
    const content = [columns.join(","), ...filtered.map((lead) => columns.map((column) => `"${String(lead[column] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const href = URL.createObjectURL(new Blob(["\ufeff" + content], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = `axis-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(href);
  }

  return <>
    <div className="flex flex-wrap gap-3 bg-white p-4">
      <label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-3.5 text-ink/35" size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar nome, CRM, contato…" className={`${inputClass} pl-10`} /></label>
      <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }} className={`${inputClass} w-auto`}><option value="">Todos os status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
      <Button onClick={exportCsv} variant="outline" className="text-navy"><Download size={16} />Exportar CSV</Button>
    </div>
    <div className="mt-4 overflow-x-auto bg-white"><table className="w-full min-w-[60rem] text-left text-sm"><thead className="border-b hairline text-[10px] uppercase tracking-wider text-ink/45"><tr>{["Nome", "CRM", "Especialidade", "Contato", "Origem / UTM", "Data", "Status"].map((label) => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{shown.map((lead) => <tr key={lead.id} onClick={() => openLead(lead)} className="cursor-pointer border-b hairline hover:bg-off-white"><td className="p-4 font-semibold">{lead.first_name} {lead.last_name}</td><td className="p-4">{lead.crm || "—"} {lead.crm_state}</td><td className="p-4">{lead.specialty || "—"}</td><td className="p-4">{lead.phone || lead.email || "—"}</td><td className="p-4">{lead.utm_source || lead.source || "Direto"}</td><td className="p-4">{formatDate(lead.created_at)}</td><td className="p-4"><Badge>{lead.status}</Badge></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-10 text-center text-sm text-ink/45">Nenhum lead corresponde aos filtros.</p>}</div>
    {filtered.length > perPage && <nav aria-label="Paginação de leads" className="mt-4 flex items-center justify-between bg-white p-4 text-sm"><span>{filtered.length} leads · página {Math.min(page, pages)} de {pages}</span><div className="flex gap-2"><Button variant="outline" className="text-navy" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Anterior</Button><Button variant="outline" className="text-navy" disabled={page >= pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>Próxima</Button></div></nav>}
    {active && <div className="fixed inset-0 z-50 bg-black/35" onClick={() => setActive(null)}><aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setActive(null)} aria-label="Fechar lead" className="float-right grid size-10 place-items-center border hairline"><X /></button><p className="eyebrow text-navy">Lead</p><h2 className="mt-3 font-editorial text-4xl text-navy">{active.first_name} {active.last_name}</h2><dl className="mt-8 grid grid-cols-2 gap-5 text-sm">{[["CRM", `${active.crm || "—"} ${active.crm_state || ""}`], ["Especialidade", active.specialty || "—"], ["Telefone", active.phone || "—"], ["E-mail", active.email || "—"], ["Origem", active.source || "—"], ["UTM", active.utm_source || "—"]].map(([key, value]) => <div key={key}><dt className="text-xs text-ink/45">{key}</dt><dd className="mt-1">{value}</dd></div>)}</dl><div className="mt-7 border-y hairline py-5"><p className="text-xs text-ink/45">Mensagem</p><p className="mt-2 whitespace-pre-wrap leading-7">{active.message}</p></div><label className="mt-6 grid gap-2 text-sm font-semibold">Status<select className={inputClass} value={active.status} disabled={busy} onChange={(event) => update(active.id, { status: event.target.value as LeadStatus })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="mt-5 grid gap-2 text-sm font-semibold">Notas<textarea className={`${inputClass} min-h-36 py-3`} defaultValue={active.notes || ""} onBlur={(event) => update(active.id, { notes: event.target.value })} /></label><div className="mt-8"><p className="eyebrow text-navy">Timeline</p><div className="mt-4 border-l border-navy/20 pl-5 text-sm"><p className="font-semibold">Lead recebido</p><p className="text-ink/45">{formatDate(active.created_at)}</p>{history.map((entry) => <div key={entry.id} className="mt-5"><p className="font-semibold">{entry.metadata?.after?.status ? `Status alterado para ${entry.metadata.after.status}` : entry.metadata?.after?.notes !== undefined ? "Notas atualizadas" : "Lead atualizado"}</p><p className="text-ink/45">{formatDate(entry.created_at)}</p></div>)}</div></div></aside></div>}
  </>;
}
