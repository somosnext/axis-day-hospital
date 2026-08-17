"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/primitives";

type Row = Record<string, unknown> & { id: string };
type Field = { key: string; label: string; type?: "text" | "textarea" | "json" | "number" | "boolean" };

export function ContentManager({ resource, initial, fields }: { resource: string; initial: Row[]; fields: Field[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<Row | null>(null);
  const [error, setError] = useState("");

  function fresh() {
    return Object.fromEntries([["id", ""], ...fields.map((field) => [field.key, field.type === "boolean" ? true : field.type === "number" ? 0 : ""])]) as Row;
  }

  function displayValue(value: unknown, type?: Field["type"]) {
    return type === "json" && value && typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
  }

  async function save() {
    if (!editing) return;
    setError("");
    const method = editing.id ? "PATCH" : "POST";
    const response = await fetch(`/api/admin/content/${resource}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error || "Não foi possível salvar.");
      return;
    }
    const { row } = await response.json();
    setRows((current) => method === "POST" ? [...current, row] : current.map((item) => item.id === row.id ? row : item));
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("Excluir este item?")) return;
    const response = await fetch(`/api/admin/content/${resource}?id=${id}`, { method: "DELETE" });
    if (response.ok) setRows((current) => current.filter((item) => item.id !== id));
    else setError("Não foi possível excluir.");
  }

  return <>
    <div className="mb-4 flex justify-end"><Button onClick={() => setEditing(fresh())}>Adicionar</Button></div>
    <div className="grid gap-3">
      {rows.map((row) => <article key={row.id} className="flex items-center justify-between gap-4 border border-navy/10 bg-white p-5">
        <div><h3 className="font-semibold text-navy">{String(row.title || row.question || row.section_key || "Item")}</h3><p className="mt-1 line-clamp-1 text-sm text-ink/45">{String(row.description || row.answer || row.eyebrow || "")}</p></div>
        <div className="flex gap-2"><button className="text-sm font-bold text-navy underline" onClick={() => setEditing(row)}>Editar</button><button className="text-sm text-red-700 underline" onClick={() => remove(row.id)}>Excluir</button></div>
      </article>)}
      {rows.length === 0 && <p className="border border-dashed hairline p-10 text-center text-sm text-ink/45">Nenhum item publicado.</p>}
    </div>
    {editing && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/35 p-4"><div className="my-8 w-full max-w-2xl bg-white p-6">
      <h2 className="font-editorial text-4xl text-navy">{editing.id ? "Editar" : "Novo item"}</h2>
      <div className="mt-6 grid gap-5">{fields.map((field) => <label key={field.key} className="grid gap-2 text-sm font-semibold text-navy"><span>{field.label}</span>
        {field.type === "textarea" || field.type === "json" ? <textarea className={`${inputClass} min-h-28 py-3 ${field.type === "json" ? "font-mono text-xs" : ""}`} value={displayValue(editing[field.key], field.type)} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.value })} /> : field.type === "boolean" ? <input type="checkbox" checked={Boolean(editing[field.key])} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.checked })} className="size-5 accent-navy" /> : <input type={field.type === "number" ? "number" : "text"} className={inputClass} value={String(editing[field.key] ?? "")} onChange={(event) => setEditing({ ...editing, [field.key]: field.type === "number" ? Number(event.target.value) : event.target.value })} />}
      </label>)}</div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-7 flex gap-2"><Button onClick={save}>Salvar</Button><Button variant="outline" className="text-navy" onClick={() => setEditing(null)}>Cancelar</Button></div>
    </div></div>}
  </>;
}
