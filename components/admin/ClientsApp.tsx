"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClientRow } from "@/lib/admin-types";
import { formatDateLong } from "@/lib/time";
import { api, btnGhost, btnGold, inputCls, labelCls, money, Notice, SlideOver } from "./ui";

export function ClientsApp() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ClientRow[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = async (query: string) => {
    const r = await api<{ clients: ClientRow[] }>(`/api/admin/clients?q=${encodeURIComponent(query)}`);
    if (r.ok) setRows(r.data.clients);
    else setError(r.data.error || "Couldn't load clients");
  };
  useEffect(() => {
    const t = setTimeout(() => load(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-white text-2xl flex-1" style={{ fontFamily: "var(--font-playfair)" }}>Clients</h1>
        <button className={btnGold} onClick={() => setAdding(true)}>Add client</button>
      </div>
      <input className={inputCls + " mb-5"} placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
      {error && <Notice>{error}</Notice>}
      {rows && rows.length === 0 && <p className="text-grey text-sm py-10 text-center">No clients yet. They appear here as people book.</p>}
      <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {rows?.map((c) => (
          <li key={c.id}>
            <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.03]">
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{c.name}</p>
                <p className="text-xs text-grey truncate">{c.email || c.phone || "No contact"}</p>
              </div>
              <div className="text-right text-xs text-grey shrink-0">
                <p>{c.visits} visit{c.visits === 1 ? "" : "s"}{c.depositsCents ? ` · ${money(c.depositsCents)} deposits` : ""}</p>
                <p>{c.nextVisit ? `Next ${formatDateLong(c.nextVisit)}` : c.lastVisit ? `Last ${formatDateLong(c.lastVisit)}` : ""}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {adding && (
        <AddClient onClose={() => setAdding(false)} onDone={() => { setAdding(false); load(q.trim()); }} />
      )}
    </main>
  );
}

function AddClient({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<any>) => setF({ ...f, [k]: e.target.value });
  return (
    <SlideOver title="Add client" onClose={onClose}>
      <div><label className={labelCls}>Name</label><input className={inputCls} value={f.name} onChange={set("name")} /></div>
      <div><label className={labelCls}>Phone</label><input className={inputCls} inputMode="tel" value={f.phone} onChange={set("phone")} /></div>
      <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={f.email} onChange={set("email")} /></div>
      <div><label className={labelCls}>Notes</label><textarea rows={3} className={inputCls} value={f.notes} onChange={set("notes")} /></div>
      {error && <Notice>{error}</Notice>}
      <div className="flex gap-2">
        <button className={btnGold} disabled={busy} onClick={async () => {
          setBusy(true);
          const r = await api("/api/admin/clients", { method: "POST", body: f });
          setBusy(false);
          r.ok ? onDone() : setError(r.data.error || "Couldn't save");
        }}>Save</button>
        <button className={btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </SlideOver>
  );
}
