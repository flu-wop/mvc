"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Appointment } from "@/lib/admin-types";
import { formatDateLong } from "@/lib/time";
import { api, btnGhost, inputCls, labelCls, money, Notice } from "./ui";

type Client = { id: number; name: string; email: string | null; phone: string | null; notes: string | null };

export function ClientDetail({ id }: { id: number }) {
  const [client, setClient] = useState<Client | null>(null);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", notes: "" });
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api<{ client: Client; appointments: Appointment[] }>(`/api/admin/clients/${id}`).then((r) => {
      if (!r.ok) return setMissing(true);
      setClient(r.data.client);
      setAppts(r.data.appointments);
      const c = r.data.client;
      setF({ name: c.name, email: c.email ?? "", phone: c.phone ?? "", notes: c.notes ?? "" });
    });
  }, [id]);

  if (missing) return <main className="mx-auto max-w-3xl px-4 py-10"><Notice>Client not found.</Notice></main>;
  if (!client) return <main className="mx-auto max-w-3xl px-4 py-10 text-grey text-sm">Loading…</main>;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<any>) => setF({ ...f, [k]: e.target.value });

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-6 space-y-6">
      <Link href="/admin/clients" className="text-xs text-gold">← All clients</Link>
      <h1 className="text-white text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>{client.name}</h1>

      <section className="space-y-3">
        <div><label className={labelCls}>Name</label><input className={inputCls} value={f.name} onChange={set("name")} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={labelCls}>Phone</label><input className={inputCls} inputMode="tel" value={f.phone} onChange={set("phone")} /></div>
          <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={f.email} onChange={set("email")} /></div>
        </div>
        <div><label className={labelCls}>Notes</label><textarea rows={4} className={inputCls} value={f.notes} onChange={set("notes")} placeholder="Preferences, shape, allergies, anything to remember" /></div>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <button className={btnGhost} onClick={async () => {
          const r = await api(`/api/admin/clients/${id}`, { method: "PATCH", body: f });
          setMsg(r.ok ? { kind: "ok", text: "Saved" } : { kind: "error", text: r.data.error || "Couldn't save" });
        }}>Save changes</button>
      </section>

      <section>
        <h2 className="text-white text-lg mb-3" style={{ fontFamily: "var(--font-playfair)" }}>History</h2>
        {appts.length === 0 && <p className="text-grey text-sm">No appointments yet.</p>}
        <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {appts.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <i className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{a.service}</p>
                <p className="text-xs text-grey">{formatDateLong(a.date)} · {a.time}</p>
                {a.notes && <p className="text-xs text-grey mt-0.5">{a.notes}</p>}
              </div>
              <div className="text-right text-xs text-grey shrink-0">
                <p className="capitalize">{a.status.replace("_", " ")}</p>
                <p>{a.totalCents != null ? money(a.totalCents) : `${money(a.depositCents)} dep.`}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
