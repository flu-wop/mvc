"use client";
import { useEffect, useState } from "react";
import { groupByCategory } from "@/lib/service-defaults";
import { api, btnGhost, btnGold, inputCls, labelCls, Notice, SlideOver } from "./ui";

type Svc = { slug: string; title: string; blurb: string; category: string; paddingMinutes: number; fromCents: number; durationMinutes: number; depositCents: number; color: string; active: boolean };
type Form = { title: string; blurb: string; category: string; padding: string; price: string; duration: string; deposit: string; color: string; active: boolean };
type Add = { id: number; name: string; priceCents: number; durationMinutes: number; active: boolean };

const toForm = (s?: Svc): Form => ({
  title: s?.title ?? "",
  blurb: s?.blurb ?? "",
  category: s?.category ?? "",
  padding: String(s?.paddingMinutes ?? 0),
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
      {groupByCategory((list ?? []).map((x, i) => ({ ...x, image: "", sort: i }))).map((g) => (
        <section key={g.category} className="mb-6">
          <h2 className="text-gold text-[11px] tracking-[0.25em] uppercase mb-2">{g.category}</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {g.items.map((s) => (
              <li key={s.slug}>
                <button onClick={() => setEdit({ svc: s })} className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-white/[0.03]">
                  <i className="w-4 h-4 rounded-sm shrink-0" style={{ background: s.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${s.active ? "text-white" : "text-grey line-through"}`}>{s.title}</p>
                    <p className="text-xs text-grey">{s.durationMinutes} min{s.paddingMinutes ? ` + ${s.paddingMinutes} cleanup` : ""} · from ${s.fromCents / 100} · ${s.depositCents / 100} deposit</p>
                  </div>
                  {!s.active && <span className="text-xs text-grey">Off</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 className="text-white text-xl mt-10 mb-1" style={{ fontFamily: "var(--font-playfair)" }}>Add-ons</h2>
      <p className="text-grey text-sm mb-4">Extras clients can tack on while booking. Added minutes lengthen the appointment automatically.</p>
      <AddonsList />
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
      category: f.category,
      paddingMinutes: Number(f.padding) || 0,
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
      <div><label className={labelCls}>Category</label><input className={inputCls} value={f.category} onChange={set("category")} placeholder="Acrylic, Gel-X, Pedicures…" /></div>
      <div><label className={labelCls}>Short description</label><textarea rows={2} className={inputCls} value={f.blurb} onChange={set("blurb")} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className={labelCls}>Minutes</label><input className={inputCls} inputMode="numeric" value={f.duration} onChange={set("duration")} /></div>
        <div><label className={labelCls}>From ($)</label><input className={inputCls} inputMode="decimal" value={f.price} onChange={set("price")} /></div>
        <div><label className={labelCls}>Deposit ($)</label><input className={inputCls} inputMode="decimal" value={f.deposit} onChange={set("deposit")} /></div>
      </div>
      <div><label className={labelCls}>Cleanup minutes after (blocks the calendar, clients don&apos;t see it)</label><input className={inputCls} inputMode="numeric" value={f.padding} onChange={set("padding")} /></div>
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

function AddonsList() {
  const [list, setList] = useState<Add[] | null>(null);
  const [edit, setEdit] = useState<{ a?: Add } | null>(null);
  const load = async () => {
    const r = await api<{ addons: Add[] }>("/api/admin/addons");
    if (r.ok) setList(r.data.addons);
  };
  useEffect(() => { load(); }, []);
  return (
    <>
      <button className={`${btnGhost} mb-3`} onClick={() => setEdit({})}>Add an add-on</button>
      <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {list?.map((a) => (
          <li key={a.id}>
            <button onClick={() => setEdit({ a })} className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-white/[0.03]">
              <p className={`flex-1 truncate ${a.active ? "text-white" : "text-grey line-through"}`}>{a.name}</p>
              <span className="text-xs text-grey">+${a.priceCents / 100}{a.durationMinutes ? ` · ${a.durationMinutes} min` : ""}</span>
            </button>
          </li>
        ))}
      </ul>
      {edit && <AddonEditor a={edit.a} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </>
  );
}

function AddonEditor({ a, onClose, onSaved }: { a?: Add; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(a?.name ?? "");
  const [price, setPrice] = useState(a ? String(a.priceCents / 100) : "");
  const [mins, setMins] = useState(a ? String(a.durationMinutes) : "0");
  const [active, setActive] = useState(a?.active ?? true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    const body = { name, priceCents: Math.round(Number(price) * 100), durationMinutes: Number(mins), active };
    setBusy(true);
    const r = a ? await api(`/api/admin/addons/${a.id}`, { method: "PATCH", body }) : await api("/api/admin/addons", { method: "POST", body });
    setBusy(false);
    r.ok ? onSaved() : setError(r.data.error || "Couldn't save");
  }
  return (
    <SlideOver title={a ? a.name : "New add-on"} onClose={onClose}>
      <div><label className={labelCls}>Name</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Price ($)</label><input className={inputCls} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        <div><label className={labelCls}>Added minutes</label><input className={inputCls} inputMode="numeric" value={mins} onChange={(e) => setMins(e.target.value)} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Offered online
      </label>
      {!a && <p className="text-xs text-grey">New add-ons are offered with every service.</p>}
      {error && <Notice>{error}</Notice>}
      <div className="flex gap-2">
        <button className={btnGold} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button>
        <button className={btnGhost} onClick={onClose}>Cancel</button>
      </div>
    </SlideOver>
  );
}
