"use client";
import { useEffect, useState } from "react";
import type { Appointment, ClientRow } from "@/lib/admin-types";
import { formatDateLong, formatTime } from "@/lib/time";
import { api, btnGhost, btnGold, fromInputTime, inputCls, labelCls, money, Notice, SlideOver, toInputTime } from "./ui";

type Conflict = { kind: string; message: string };
type Svc = { slug: string; title: string; color: string; durationMinutes: number; depositCents: number };

const STATUS_LABEL: Record<string, string> = {
  pending: "Deposit pending",
  paid: "Deposit paid",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
  needs_review: "Needs review",
};

export function AppointmentPanel({
  appt, onClose, onChanged,
}: {
  appt: Appointment;
  onClose: () => void;
  onChanged: (a: Appointment) => void;
}) {
  const [a, setA] = useState(appt);
  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [date, setDate] = useState(a.date);
  const [time, setTime] = useState(toInputTime(a.startMin));
  const [sendEmail, setSendEmail] = useState(!!a.email);
  const [notes, setNotes] = useState(a.notes ?? "");
  const [total, setTotal] = useState(a.totalCents == null ? "" : String(a.totalCents / 100));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [saved, setSaved] = useState("");

  async function act(body: Record<string, unknown>, after?: () => void) {
    setBusy(true);
    setError("");
    setConflicts([]);
    const r = await api<{ appointment: Appointment }>(`/api/admin/appointments/${a.id}`, { method: "PATCH", body });
    setBusy(false);
    if (r.ok) {
      setA(r.data.appointment);
      onChanged(r.data.appointment);
      setMode("view");
      after?.();
    } else if (r.status === 409 && r.data.conflicts) {
      setConflicts(r.data.conflicts);
      setError(r.data.error || "Conflict");
    } else setError(r.data.error || "Something went wrong");
  }

  const reschedule = (force = false) => {
    const m = fromInputTime(time);
    if (m == null) return setError("Choose a time");
    act({ action: "reschedule", date, time: formatTime(m), force, sendEmail });
  };

  const cancelled = a.status === "cancelled";
  const closedOut = ["completed", "no_show", "cancelled"].includes(a.status);

  return (
    <SlideOver title={a.name} onClose={onClose}>
      <div className="flex items-center gap-2">
        <i className="w-3 h-3 rounded-sm" style={{ background: a.color }} />
        <span className="text-white">{a.service}</span>
        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full border ${a.status === "needs_review" ? "border-red-400/60 text-red-300" : "border-border text-grey"}`}>
          {STATUS_LABEL[a.status] ?? a.status}
        </span>
      </div>

      <div className="text-sm text-white/90 space-y-1">
        <p>{formatDateLong(a.date)}</p>
        <p className="text-grey">{a.time} · {a.durationMinutes} min</p>
      </div>

      {a.status === "needs_review" && (
        <Notice>
          She paid, but this time was already taken or blocked. Reschedule her to an open time, or cancel and refund the deposit in Stripe.
        </Notice>
      )}

      <div className="text-sm space-y-1">
        {a.phone && <p><a className="text-gold" href={`tel:${a.phone}`}>{a.phone}</a></p>}
        {a.email && <p><a className="text-gold break-all" href={`mailto:${a.email}`}>{a.email}</a></p>}
        <p className="text-grey">
          Deposit {money(a.depositCents)} {a.depositPaid ? "received" : "not received yet"} · {a.source === "manual" ? "added by hand" : "booked online"}
        </p>
        {a.message && <p className="text-grey">Client note: {a.message}</p>}
      </div>

      {error && (
        <Notice>
          {error}
          {conflicts.length > 0 && (
            <ul className="mt-1.5 list-disc pl-5">{conflicts.map((c, i) => <li key={i}>{c.message}</li>)}</ul>
          )}
        </Notice>
      )}

      {mode === "reschedule" && (
        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Date</label><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><label className={labelCls}>Time</label><input type="time" step={300} className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} /></div>
          </div>
          {a.email && (
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} /> Email {a.name.split(" ")[0]} the new time
            </label>
          )}
          <div className="flex gap-2 flex-wrap">
            <button disabled={busy} className={btnGold} onClick={() => reschedule(false)}>Move appointment</button>
            {conflicts.length > 0 && <button disabled={busy} className={btnGhost} onClick={() => reschedule(true)}>Book anyway</button>}
            <button className={btnGhost} onClick={() => { setMode("view"); setError(""); setConflicts([]); }}>Back</button>
          </div>
        </div>
      )}

      {mode === "cancel" && (
        <div className="space-y-3 rounded-2xl border border-red-500/30 p-4">
          <p className="text-sm text-white/90">Cancel this appointment? The slot opens up again.</p>
          {a.email && (
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} /> Email {a.name.split(" ")[0]} that it was cancelled
            </label>
          )}
          <p className="text-xs text-grey">Deposits are refunded in Stripe, not here.</p>
          <div className="flex gap-2">
            <button disabled={busy} className={btnGold} onClick={() => act({ action: "cancel", sendEmail })}>Yes, cancel it</button>
            <button className={btnGhost} onClick={() => setMode("view")}>Keep it</button>
          </div>
        </div>
      )}

      {mode === "view" && (
        <div className="flex flex-wrap gap-2">
          {!closedOut && <button className={btnGold} disabled={busy} onClick={() => setMode("reschedule")}>Reschedule</button>}
          {a.status === "pending" && <button className={btnGhost} disabled={busy} onClick={() => act({ action: "mark_paid" })}>Mark deposit paid</button>}
          {["paid", "pending", "needs_review"].includes(a.status) && (
            <>
              <button className={btnGhost} disabled={busy} onClick={() => act({ action: "complete" })}>Mark completed</button>
              <button className={btnGhost} disabled={busy} onClick={() => act({ action: "no_show" })}>No-show</button>
            </>
          )}
          {["completed", "no_show", "cancelled"].includes(a.status) && (
            <button className={btnGhost} disabled={busy} onClick={() => act({ action: "restore" })}>Restore</button>
          )}
          {!cancelled && <button className={btnGhost + " !text-red-300 !border-red-500/30"} disabled={busy} onClick={() => setMode("cancel")}>Cancel</button>}
        </div>
      )}

      <div className="space-y-3 pt-2 border-t border-border">
        <div>
          <label className={labelCls}>Service total ($)</label>
          <input className={inputCls} inputMode="decimal" placeholder={`From ${money(a.fromCents)}`} value={total} onChange={(e) => setTotal(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Private notes</label>
          <textarea className={inputCls} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Shape, length, allergies, favorite colors…" />
        </div>
        <button
          disabled={busy}
          className={btnGhost}
          onClick={async () => {
            const t = total.trim() === "" ? null : Math.round(Number(total) * 100);
            if (t !== null && !Number.isFinite(t)) return setError("Total looks wrong");
            setBusy(true);
            const r = await api<{ appointment: Appointment }>(`/api/admin/appointments/${a.id}`, {
              method: "PATCH",
              body: { action: "update", notes, totalCents: t },
            });
            setBusy(false);
            if (r.ok) { setA(r.data.appointment); onChanged(r.data.appointment); setSaved("Saved"); setTimeout(() => setSaved(""), 1500); }
            else setError(r.data.error || "Couldn't save");
          }}
        >
          {saved || "Save notes"}
        </button>
        {a.clientId && <a className="block text-xs text-gold" href={`/admin/clients/${a.clientId}`}>View client history →</a>}
      </div>
    </SlideOver>
  );
}

export function NewAppointmentPanel({
  services, initialDate, initialStartMin, onClose, onCreated,
}: {
  services: Svc[];
  initialDate: string;
  initialStartMin: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const svc = services.find((s) => s.slug === serviceSlug);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(toInputTime(Math.min(1439, initialStartMin)));
  const [duration, setDuration] = useState(String(svc?.durationMinutes ?? 90));
  const [q, setQ] = useState("");
  const [found, setFound] = useState<ClientRow[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [depositPaid, setDepositPaid] = useState(false);
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    if (q.trim().length < 2 || clientId) return setFound([]);
    const t = setTimeout(async () => {
      const r = await api<{ clients: ClientRow[] }>(`/api/admin/clients?q=${encodeURIComponent(q.trim())}`);
      if (r.ok) setFound(r.data.clients.slice(0, 5));
    }, 200);
    return () => clearTimeout(t);
  }, [q, clientId]);

  async function submit(force = false) {
    setError("");
    const m = fromInputTime(time);
    if (m == null) return setError("Choose a time");
    if (!name.trim()) return setError("Add the client's name");
    setBusy(true);
    const r = await api(`/api/admin/appointments`, {
      method: "POST",
      body: { serviceSlug, date, time: formatTime(m), durationMinutes: Number(duration), name, email, phone, clientId, depositPaid, notes, sendEmail, force },
    });
    setBusy(false);
    if (r.ok) return onCreated();
    if (r.status === 409 && r.data.conflicts) {
      setConflicts(r.data.conflicts);
      setError("That time has conflicts");
    } else setError(r.data.error || "Couldn't add it");
  }

  return (
    <SlideOver title="New appointment" onClose={onClose}>
      <div>
        <label className={labelCls}>Find existing client</label>
        <input className={inputCls} placeholder="Name, email or phone" value={q} onChange={(e) => { setQ(e.target.value); setClientId(null); }} />
        {found.length > 0 && (
          <ul className="mt-2 rounded-xl border border-border divide-y divide-border">
            {found.map((c) => (
              <li key={c.id}>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                  onClick={() => { setClientId(c.id); setName(c.name); setEmail(c.email ?? ""); setPhone(c.phone ?? ""); setQ(c.name); setFound([]); }}
                >
                  {c.name} <span className="text-grey text-xs">{c.email || c.phone}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div><label className={labelCls}>Name</label><input className={inputCls} value={name} onChange={(e) => { setName(e.target.value); setClientId(null); }} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Phone</label><input className={inputCls} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Service</label>
        <select
          className={inputCls}
          value={serviceSlug}
          onChange={(e) => {
            setServiceSlug(e.target.value);
            const s = services.find((x) => x.slug === e.target.value);
            if (s) setDuration(String(s.durationMinutes));
          }}
        >
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2"><label className={labelCls}>Date</label><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className={labelCls}>Minutes</label><input className={inputCls} inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
      </div>
      <div><label className={labelCls}>Start time</label><input type="time" step={300} className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} /></div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={depositPaid} onChange={(e) => setDepositPaid(e.target.checked)} />
        Deposit received{svc ? ` (${money(svc.depositCents)})` : ""}
      </label>
      {email && (
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} /> Email a confirmation
        </label>
      )}
      <div><label className={labelCls}>Notes</label><textarea rows={3} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>

      {error && (
        <Notice>
          {error}
          {conflicts.length > 0 && <ul className="mt-1.5 list-disc pl-5">{conflicts.map((c, i) => <li key={i}>{c.message}</li>)}</ul>}
        </Notice>
      )}
      <div className="flex gap-2 flex-wrap">
        <button className={btnGold} disabled={busy} onClick={() => submit(false)}>{busy ? "Saving…" : "Add appointment"}</button>
        {conflicts.length > 0 && <button className={btnGhost} disabled={busy} onClick={() => submit(true)}>Book anyway</button>}
      </div>
    </SlideOver>
  );
}
