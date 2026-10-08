"use client";
import { useEffect, useState } from "react";
import { api, btnGhost, btnGold, inputCls, labelCls, Notice, SlideOver } from "./ui";

type Svc = { slug: string; title: string; blurb: string; fromCents: number; durationMinutes: number; depositCents: number; color: string; active: boolean };
type Form = { title: string; blurb: string; price: string; duration: string; deposit: string; color: string; active: boolean };

const toForm = (s?: Svc): Form => ({
  title: s?.title ?? "",
  blurb: s?.blurb ?? "",
  price: s ? String(s.fromCents / 100) : "",
  duration: s ? String(s.durationMinutes) : "90",
  deposit: s ? String(s.depositCents / 100) : "25",
  color: s?.color ?? "#C9A96E",
  active: s?.active ?? true,
});

export function ServicesApp() {
  const [list, setList] = useState<Svc[] | null>(null);
  const [edit, setEdit] = useState<{ svc?: Svc } | null>(null);

  const load = async () => {
    const r = await api<{ services: Svc[] }>("/api/admin/services");
    if (r.ok) setList(r.data.services);
  };
  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-white text-2xl flex-1" style={{ fontFamily: "var(--font-playfair)" }}>Services</h1>
        <button className={btnGold} onClick={() => setEdit({})}>Add service</button>
      </div>
      <p className="text-grey text-sm mb-5">Duration controls how much calendar time a booking takes. The color is what you see on the calendar. Turn a service off to hide it from online booking without losing past appointments.</p>
      <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {list?.map((s) => (
          <li key={s.slug}>
            <button onClick={() => setEdit({ svc: s })} className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-white/[0.03]">
              <i className="w-4 h-4 rounded-sm shrink-0" style={{ background: s.color }} />
              <div className="flex-1 min-w-0">
                <p className={`truncate ${s.active ? "text-white" : "text-grey line-through"}`}>{s.title}</p>
                <p className="text-xs text-grey">{s.durationMinutes} min · from ${s.fromCents / 100} · ${s.depositCents / 100} deposit</p>
              </div>
              {!s.active && <span className="text-xs text-grey">Off</span>}
            </button>
          </li>
        ))}
      </ul>
      {edit && <ServiceEditor svc={edit.svc} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </main>
  );
}

function ServiceEditor({ svc, onClose, onSaved }: { svc?: Svc; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Form>(toForm(svc));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<any>) => setF({ ...f, [k]: e.target.value });

  async function save() {
    const body = {
      title: f.title,
      blurb: f.blurb,
      durationMinutes: Number(f.duration),
      fromCents: Math.round(Number(f.price) * 100),
      depositCents: Math.round(Number(f.deposit) * 100),
      color: f.color,
      active: f.active,
    };
    setBusy(true);
    const r = svc
      ? await api(`/api/admin/services/${svc.slug}`, { method: "PATCH", body })
      : await api("/api/admin/services", { method: "POST", body });
    setBusy(false);
    r.ok ? onSaved() : setError(r.data.error || "Couldn't save");
  }

  return (
    <SlideOver title={svc ? svc.title : "New service"} onClose={onClose}>
      <div><label className={labelCls}>Name</label><input className={inputCls} value={f.title} onChange={set("title")} /></div>
      <div><label className={labelCls}>Short description</label><textarea rows={2} className={inputCls} value={f.blurb} onChange={set("blurb")} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>Minutes</label><input className={inputCls} inputMode="numeric" value={f.duration} onChange={set("duration")} /></div>
        <div><label className={labelCls}>From ($)</label><input className={inputCls} inputMode="decimal" value={f.price} onChange={set("price")} /></div>
        <div><label className={labelCls}>Deposit ($)</label><input className={inputCls} inputMode="decimal" value={f.deposit} onChange={set("deposit")} /></div>
      </div>
      <div>
        <label className={labelCls}>Calendar color</label>
        <input type="color" value={f.color} onChange={set("color")} className="h-11 w-24 rounded-lg bg-charcoal border border-border" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Available for online booking
      </label>
      {error && <Notice>{error}</Notice>}
      <div className="flex gap-2">
        <button className={btnGold} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button>
        <button className={btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </SlideOver>
  );
}
