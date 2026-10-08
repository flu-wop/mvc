"use client";
import { useEffect, useState } from "react";
import { formatDateLong } from "@/lib/time";
import { api, btnGhost, btnGold, fromInputTime, inputCls, labelCls, Notice, toInputTime } from "./ui";

type Hour = { weekday: number; closed: boolean; openMin: number; closeMin: number };
type Settings = { slotMinutes: number; bufferMinutes: number; minNoticeHours: number; remindersEnabled: boolean };
type Blocked = { id: number; startDate: string; endDate: string; startMin: number | null; endMin: number | null; reason: string | null };
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function HoursApp() {
  const [hours, setHours] = useState<Hour[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
  const [bf, setBf] = useState({ startDate: "", endDate: "", allDay: true, start: "09:00", end: "18:00", reason: "" });

  const loadBlocked = async () => {
    const r = await api<{ blocked: Blocked[] }>("/api/admin/blocked");
    if (r.ok) setBlocked(r.data.blocked);
  };
  useEffect(() => {
    api<{ hours: Hour[]; settings: Settings }>("/api/admin/hours").then((r) => {
      if (r.ok) { setHours(r.data.hours); setSettings(r.data.settings); }
    });
    loadBlocked();
  }, []);

  if (!settings) return <main className="mx-auto max-w-3xl px-4 py-10 text-grey text-sm">Loading…</main>;

  const upd = (wd: number, patch: Partial<Hour>) => setHours(hours.map((h) => (h.weekday === wd ? { ...h, ...patch } : h)));

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-6 space-y-10">
      <section className="space-y-4">
        <h1 className="text-white text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Hours</h1>
        <div className="rounded-2xl border border-border divide-y divide-border">
          {hours.map((h) => (
            <div key={h.weekday} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-24 text-sm text-white">{DAYS[h.weekday]}</span>
              <label className="flex items-center gap-1.5 text-xs text-grey">
                <input type="checkbox" checked={!h.closed} onChange={(e) => upd(h.weekday, { closed: !e.target.checked })} /> Open
              </label>
              {!h.closed && (
                <>
                  <input type="time" className={inputCls + " !w-auto"} value={toInputTime(h.openMin)} onChange={(e) => { const m = fromInputTime(e.target.value); if (m != null) upd(h.weekday, { openMin: m }); }} />
                  <span className="text-grey text-xs">to</span>
                  <input type="time" className={inputCls + " !w-auto"} value={toInputTime(h.closeMin)} onChange={(e) => { const m = fromInputTime(e.target.value); if (m != null) upd(h.weekday, { closeMin: m }); }} />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Start times every</label>
            <select className={inputCls} value={settings.slotMinutes} onChange={(e) => setSettings({ ...settings, slotMinutes: Number(e.target.value) })}>
              {[15, 30, 45, 60].map((n) => <option key={n} value={n}>{n} minutes</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Buffer between clients</label>
            <select className={inputCls} value={settings.bufferMinutes} onChange={(e) => setSettings({ ...settings, bufferMinutes: Number(e.target.value) })}>
              {[0, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n ? `${n} minutes` : "None"}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Minimum notice</label>
            <select className={inputCls} value={settings.minNoticeHours} onChange={(e) => setSettings({ ...settings, minNoticeHours: Number(e.target.value) })}>
              {[0, 1, 2, 4, 12, 24, 48].map((n) => <option key={n} value={n}>{n ? `${n} hours` : "None"}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={settings.remindersEnabled} onChange={(e) => setSettings({ ...settings, remindersEnabled: e.target.checked })} />
          Email clients a reminder the day before
        </label>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <button className={btnGold} onClick={async () => {
          const r = await api("/api/admin/hours", { method: "PUT", body: { hours, settings } });
          setMsg(r.ok ? { kind: "ok", text: "Saved. Online booking now follows these hours." } : { kind: "error", text: r.data.error || "Couldn't save" });
        }}>Save hours</button>
      </section>

      <section className="space-y-4">
        <h2 className="text-white text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Blocked time</h2>
        <p className="text-grey text-sm">Days off, vacations, appointments elsewhere. Clients can't book these times.</p>
        <div className="rounded-2xl border border-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>From</label><input type="date" className={inputCls} value={bf.startDate} onChange={(e) => setBf({ ...bf, startDate: e.target.value, endDate: bf.endDate || e.target.value })} /></div>
            <div><label className={labelCls}>Through</label><input type="date" className={inputCls} value={bf.endDate} onChange={(e) => setBf({ ...bf, endDate: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" checked={bf.allDay} onChange={(e) => setBf({ ...bf, allDay: e.target.checked })} /> All day</label>
          {!bf.allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Start</label><input type="time" className={inputCls} value={bf.start} onChange={(e) => setBf({ ...bf, start: e.target.value })} /></div>
              <div><label className={labelCls}>End</label><input type="time" className={inputCls} value={bf.end} onChange={(e) => setBf({ ...bf, end: e.target.value })} /></div>
            </div>
          )}
          <input className={inputCls} placeholder="Reason (only you see this)" value={bf.reason} onChange={(e) => setBf({ ...bf, reason: e.target.value })} />
          <button className={btnGhost} onClick={async () => {
            const r = await api<{ affected: { name: string; date: string; time: string }[] }>("/api/admin/blocked", {
              method: "POST",
              body: { startDate: bf.startDate, endDate: bf.endDate || bf.startDate, allDay: bf.allDay, startMin: fromInputTime(bf.start), endMin: fromInputTime(bf.end), reason: bf.reason },
            });
            if (!r.ok) return setMsg({ kind: "error", text: r.data.error || "Couldn't block that time" });
            const hit = r.data.affected ?? [];
            setMsg(hit.length
              ? { kind: "warn", text: `Blocked. These existing appointments are inside it, so move or cancel them: ${hit.map((h) => `${h.name} (${h.date} ${h.time})`).join(", ")}` }
              : { kind: "ok", text: "Time blocked." });
            setBf({ ...bf, reason: "" });
            loadBlocked();
          }}>Block this time</button>
        </div>
        <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {blocked.length === 0 && <li className="px-4 py-4 text-sm text-grey">Nothing blocked.</li>}
          {blocked.map((b) => (
            <li key={b.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <div className="flex-1">
                <p className="text-white">
                  {formatDateLong(b.startDate)}{b.endDate !== b.startDate ? ` – ${formatDateLong(b.endDate)}` : ""}
                </p>
                <p className="text-xs text-grey">
                  {b.startMin == null ? "All day" : `${toInputTime(b.startMin)} to ${toInputTime(b.endMin ?? 0)}`}{b.reason ? ` · ${b.reason}` : ""}
                </p>
              </div>
              <button className="text-xs text-red-300" onClick={async () => { await api(`/api/admin/blocked/${b.id}`, { method: "DELETE" }); loadBlocked(); }}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
