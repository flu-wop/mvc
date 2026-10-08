"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Appointment } from "@/lib/admin-types";
import { addDays, formatDateLong, formatTime, weekdayOf } from "@/lib/time";
import { api, btnGhost, btnGold, Notice } from "./ui";
import { AppointmentPanel, NewAppointmentPanel } from "./AppointmentPanels";

type Svc = { slug: string; title: string; color: string; durationMinutes: number; depositCents: number; fromCents: number; active: boolean };
type Hour = { weekday: number; closed: boolean; openMin: number; closeMin: number };
type Blocked = { id: number; startDate: string; endDate: string; startMin: number | null; endMin: number | null; reason: string | null };
type Data = {
  appointments: Appointment[];
  blocked: Blocked[];
  hours: Hour[];
  services: Svc[];
  settings: { slotMinutes: number };
  now: { date: string; minutes: number };
};
type View = "day" | "week" | "month";

const PX_PER_MIN = 0.95;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfWeek = (iso: string) => addDays(iso, -weekdayOf(iso));
const monthStart = (iso: string) => iso.slice(0, 8) + "01";
const shortDay = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
};
const monthLabel = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// Side-by-side lanes for overlapping appointments within one day.
function pack(items: Appointment[]) {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin);
  const out: { a: Appointment; lane: number; lanes: number }[] = [];
  let cluster: typeof out = [];
  let clusterEnd = -1;
  const flush = () => {
    const lanes = Math.max(1, ...cluster.map((c) => c.lane + 1));
    cluster.forEach((c) => (c.lanes = lanes));
    out.push(...cluster);
    cluster = [];
  };
  const laneEnds: number[] = [];
  for (const a of sorted) {
    if (a.startMin >= clusterEnd && cluster.length) {
      flush();
      laneEnds.length = 0;
    }
    let lane = laneEnds.findIndex((e) => e <= a.startMin);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = a.startMin + a.durationMinutes;
    cluster.push({ a, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, a.startMin + a.durationMinutes);
  }
  if (cluster.length) flush();
  return out;
}

export function CalendarApp({ feedUnprotected }: { feedUnprotected: boolean }) {
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState<string>("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [creating, setCreating] = useState<{ date: string; startMin: number } | null>(null);
  const loadedKey = useRef("");

  // Phones get the day view; the server clock decides "today" (shop time).
  useEffect(() => {
    setView(window.innerWidth < 768 ? "day" : "week");
    api<{ now: { date: string } }>(`/api/admin/calendar?from=2000-01-01&to=2000-01-01`).then((r) => {
      if (r.ok) setAnchor((r.data as any).now.date);
    });
  }, []);

  const range = useMemo(() => {
    if (!anchor) return null;
    if (view === "day") return { from: anchor, to: anchor };
    if (view === "week") {
      const s = startOfWeek(anchor);
      return { from: s, to: addDays(s, 6) };
    }
    const s = startOfWeek(monthStart(anchor));
    return { from: s, to: addDays(s, 41) };
  }, [anchor, view]);

  const load = useCallback(async () => {
    if (!range) return;
    const r = await api<Data>(`/api/admin/calendar?from=${range.from}&to=${range.to}`);
    if (r.ok) {
      setData(r.data as Data);
      setError("");
    } else setError(r.data.error || "Couldn't load the calendar");
  }, [range]);

  useEffect(() => {
    const key = range ? `${range.from}_${range.to}` : "";
    if (key && key !== loadedKey.current) loadedKey.current = key;
    load();
  }, [load, range]);

  // Keep the calendar fresh when Margie switches back to the tab.
  useEffect(() => {
    const h = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [load]);

  const step = (dir: 1 | -1) => {
    if (!anchor) return;
    if (view === "day") setAnchor(addDays(anchor, dir));
    else if (view === "week") setAnchor(addDays(anchor, 7 * dir));
    else {
      const [y, m] = anchor.split("-").map(Number);
      const d = new Date(Date.UTC(y, m - 1 + dir, 1));
      setAnchor(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`);
    }
  };

  const title =
    !anchor ? "" : view === "day" ? formatDateLong(anchor) : view === "week" ? `${shortDay(startOfWeek(anchor))} – ${shortDay(addDays(startOfWeek(anchor), 6))}` : monthLabel(anchor);

  const activeServices = data?.services.filter((s) => s.active) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-3 md:px-8 py-5">
      {feedUnprotected && (
        <div className="mb-4">
          <Notice kind="warn">
            Your calendar feed link is public to anyone who has it. Set <code>CALENDAR_FEED_TOKEN</code> in Vercel to lock it, then re-subscribe with the new link.
          </Notice>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <button aria-label="Previous" onClick={() => step(-1)} className={btnGhost + " !px-2.5"}><ChevronLeft className="w-4 h-4" /></button>
          <button aria-label="Next" onClick={() => step(1)} className={btnGhost + " !px-2.5"}><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => data && setAnchor(data.now.date)} className={btnGhost}>Today</button>
        </div>
        <h1 className="text-white text-xl md:text-2xl flex-1 min-w-[140px]" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h1>
        <div className="flex rounded-full border border-border overflow-hidden text-xs">
          {(["day", "week", "month"] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3.5 py-2 capitalize ${view === v ? "bg-gold/15 text-gold" : "text-grey hover:text-white"}`}>{v}</button>
          ))}
        </div>
        <button
          className={btnGold + " flex items-center gap-1.5"}
          onClick={() => data && setCreating({ date: anchor || data.now.date, startMin: 600 })}
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {error && <Notice>{error}</Notice>}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-[11px] text-grey">
        {activeServices.map((s) => (
          <span key={s.slug} className="flex items-center gap-1.5">
            <i className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            {s.title}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><i className="inline-block w-2.5 h-2.5 rounded-sm border border-dashed border-white/70" />Deposit pending</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-2.5 h-2.5 rounded-sm ring-1 ring-red-400" />Needs review</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "repeating-linear-gradient(45deg,#2A2A2C,#2A2A2C 2px,#141415 2px,#141415 4px)" }} />Blocked</span>
      </div>

      {!data && !error && <p className="text-grey text-sm py-10 text-center">Loading calendar…</p>}

      {data && range && view !== "month" && (
        <TimeGrid
          days={view === "day" ? [anchor] : Array.from({ length: 7 }, (_, i) => addDays(range.from, i))}
          data={data}
          onPick={setSelected}
          onSlot={(date, startMin) => setCreating({ date, startMin })}
        />
      )}
      {data && range && view === "month" && (
        <MonthGrid
          anchor={anchor}
          from={range.from}
          data={data}
          onDay={(d) => {
            setAnchor(d);
            setView("day");
          }}
        />
      )}

      {selected && (
        <AppointmentPanel
          key={selected.id}
          appt={selected}
          onClose={() => setSelected(null)}
          onChanged={(a) => {
            setSelected(a); // stays open after a cancel so a refund can follow
            load();
          }}
        />
      )}
      {creating && data && (
        <NewAppointmentPanel
          services={activeServices}
          initialDate={creating.date}
          initialStartMin={creating.startMin}
          onClose={() => setCreating(null)}
          onCreated={() => {
            setCreating(null);
            load();
          }}
        />
      )}
    </main>
  );
}

function TimeGrid({
  days, data, onPick, onSlot,
}: {
  days: string[];
  data: Data;
  onPick: (a: Appointment) => void;
  onSlot: (date: string, startMin: number) => void;
}) {
  // Grid spans the shop's open hours, stretched to fit any appointment outside them.
  const open = data.hours.filter((h) => !h.closed);
  let gridStart = open.length ? Math.min(...open.map((h) => h.openMin)) : 600;
  let gridEnd = open.length ? Math.max(...open.map((h) => h.closeMin)) : 1080;
  for (const a of data.appointments) {
    if (!days.includes(a.date)) continue;
    gridStart = Math.min(gridStart, a.startMin);
    gridEnd = Math.max(gridEnd, a.startMin + a.durationMinutes);
  }
  gridStart = Math.floor((gridStart - 30) / 60) * 60;
  gridEnd = Math.ceil((gridEnd + 30) / 60) * 60;
  gridStart = Math.max(0, gridStart);
  gridEnd = Math.min(1440, gridEnd);
  const height = (gridEnd - gridStart) * PX_PER_MIN;
  const hoursList: number[] = [];
  for (let m = gridStart; m < gridEnd; m += 60) hoursList.push(m);
  const multi = days.length > 1;
  const slot = Math.max(5, data.settings.slotMinutes);
  const nowTop = (data.now.minutes - gridStart) * PX_PER_MIN;

  return (
    <div className="rounded-2xl border border-border overflow-x-auto bg-charcoal">
      <div style={{ minWidth: multi ? 760 : 0 }}>
        <div className="flex border-b border-border sticky top-0 bg-charcoal z-10">
          <div className="w-14 shrink-0" />
          {days.map((d) => (
            <div key={d} className={`flex-1 text-center py-2 text-xs ${d === data.now.date ? "text-gold" : "text-grey"}`}>
              {DOW[weekdayOf(d)]} <span className="text-white/90">{shortDay(d)}</span>
            </div>
          ))}
        </div>
        <div className="flex relative" style={{ height }}>
          <div className="w-14 shrink-0 relative">
            {hoursList.map((m) => (
              <div key={m} className="absolute right-2 text-[10px] text-grey -translate-y-1/2" style={{ top: (m - gridStart) * PX_PER_MIN + 0 }}>
                {m === gridStart ? "" : formatTime(m).replace(":00", "")}
              </div>
            ))}
          </div>
          {days.map((d) => {
            const h = data.hours.find((x) => x.weekday === weekdayOf(d));
            const appts = pack(data.appointments.filter((a) => a.date === d));
            const blocks = data.blocked.filter((b) => b.startDate <= d && b.endDate >= d);
            return (
              <div
                key={d}
                className="flex-1 relative border-l border-border cursor-pointer"
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const raw = gridStart + (e.clientY - rect.top) / PX_PER_MIN;
                  onSlot(d, Math.max(0, Math.round(raw / slot) * slot));
                }}
              >
                {hoursList.map((m) => (
                  <div key={m} className="absolute inset-x-0 border-t border-border/60" style={{ top: (m - gridStart) * PX_PER_MIN }} />
                ))}
                {/* closed hours */}
                {(!h || h.closed
                  ? [[gridStart, gridEnd]]
                  : [[gridStart, h.openMin], [h.closeMin, gridEnd]]
                )
                  .filter(([s, e]) => e > s)
                  .map(([s, e], i) => (
                    <div key={i} className="absolute inset-x-0 bg-black/35 pointer-events-none" style={{ top: (s - gridStart) * PX_PER_MIN, height: (e - s) * PX_PER_MIN }} />
                  ))}
                {blocks.map((b) => {
                  const s = Math.max(gridStart, b.startMin ?? gridStart);
                  const e = Math.min(gridEnd, b.endMin ?? gridEnd);
                  return (
                    <div
                      key={b.id}
                      title={b.reason || "Blocked"}
                      className="absolute inset-x-0 pointer-events-none text-[10px] text-grey px-1 pt-0.5 overflow-hidden"
                      style={{
                        top: (s - gridStart) * PX_PER_MIN,
                        height: (e - s) * PX_PER_MIN,
                        background: "repeating-linear-gradient(45deg,#2A2A2C,#2A2A2C 3px,#141415 3px,#141415 7px)",
                        opacity: 0.85,
                      }}
                    >
                      {b.reason || "Blocked"}
                    </div>
                  );
                })}
                {appts.map(({ a, lane, lanes }) => {
                  const pending = a.status === "pending";
                  const review = a.status === "needs_review";
                  const done = a.status === "completed" || a.status === "no_show";
                  return (
                    <button
                      key={a.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPick(a);
                      }}
                      className={`absolute rounded-lg text-left overflow-hidden px-1.5 py-1 text-[11px] leading-tight text-ink font-medium ${review ? "ring-2 ring-red-400" : ""}`}
                      style={{
                        top: (a.startMin - gridStart) * PX_PER_MIN + 1,
                        height: Math.max(22, a.durationMinutes * PX_PER_MIN - 2),
                        left: `calc(${(lane / lanes) * 100}% + 2px)`,
                        width: `calc(${100 / lanes}% - 4px)`,
                        background: a.color,
                        border: pending ? "1.5px dashed rgba(11,11,12,0.7)" : "none",
                        opacity: done ? 0.45 : 1,
                        textDecoration: a.status === "no_show" ? "line-through" : undefined,
                      }}
                    >
                      <div className="truncate">{a.name}</div>
                      <div className="truncate opacity-75">{multi ? a.time.replace(" ", "").toLowerCase() : `${a.time} · ${a.service}`}</div>
                    </button>
                  );
                })}
                {d === data.now.date && nowTop >= 0 && nowTop <= height && (
                  <div className="absolute inset-x-0 z-[5] pointer-events-none" style={{ top: nowTop }}>
                    <div className="h-px bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-red-400 -mt-[5px] -ml-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MonthGrid({ anchor, from, data, onDay }: { anchor: string; from: string; data: Data; onDay: (d: string) => void }) {
  const days = Array.from({ length: 42 }, (_, i) => addDays(from, i));
  const month = anchor.slice(0, 7);
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-charcoal">
      <div className="grid grid-cols-7 border-b border-border text-center text-[11px] text-grey">
        {DOW.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const appts = data.appointments.filter((a) => a.date === d);
          const h = data.hours.find((x) => x.weekday === weekdayOf(d));
          const blocked = data.blocked.some((b) => b.startDate <= d && b.endDate >= d && b.startMin == null);
          const closed = !h || h.closed || blocked;
          return (
            <button
              key={d}
              onClick={() => onDay(d)}
              className={`min-h-[64px] md:min-h-[96px] border-t border-l border-border/70 p-1.5 text-left align-top ${d.startsWith(month) ? "" : "opacity-40"} ${closed ? "bg-black/30" : ""} hover:bg-white/[0.03]`}
            >
              <span className={`text-xs ${d === data.now.date ? "bg-gold text-ink rounded-full px-1.5 py-0.5 font-semibold" : "text-white/80"}`}>{Number(d.slice(8))}</span>
              <div className="mt-1 flex flex-wrap gap-0.5 md:hidden">
                {appts.slice(0, 6).map((a) => <i key={a.id} className="w-2 h-2 rounded-full" style={{ background: a.color }} />)}
              </div>
              <div className="hidden md:block mt-1 space-y-0.5">
                {appts.slice(0, 3).map((a) => (
                  <div key={a.id} className="truncate rounded px-1 text-[10px] text-ink" style={{ background: a.color }}>
                    {a.time.replace(" ", "").toLowerCase()} {a.name.split(" ")[0]}
                  </div>
                ))}
                {appts.length > 3 && <div className="text-[10px] text-grey">+{appts.length - 3} more</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
