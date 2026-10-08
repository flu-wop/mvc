"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Plain y/m/d math so the visitor's own timezone never shifts a date.
// `todayIso` comes from the server in the shop's timezone.
const pad = (n: number) => String(n).padStart(2, "0");
const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
};
const weekdayOf = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};
const monthOf = (iso: string) => iso.slice(0, 7);
const addMonths = (month: string, n: number) => {
  const [y, m] = month.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}`;
};
const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_AHEAD_DAYS = 90;

type Counts = Record<string, number>;

export default function BookingCalendar({
  todayIso,
  serviceSlug,
  selectedDate,
  onSelect,
  closedWeekdays,
}: {
  todayIso: string;
  serviceSlug: string;
  selectedDate: string | null;
  onSelect: (iso: string) => void;
  closedWeekdays: number[];
}) {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState<string>(selectedDate ?? todayIso); // any date inside what's shown
  const [counts, setCounts] = useState<Counts>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState(false);
  const lastDay = addDays(todayIso, MAX_AHEAD_DAYS);

  // Which months the current view needs (a week can straddle two).
  const weekStart = addDays(cursor, -weekdayOf(cursor));
  const needed = useMemo(() => {
    const set = new Set<string>();
    if (view === "month") set.add(monthOf(cursor));
    else for (let i = 0; i < 7; i++) set.add(monthOf(addDays(weekStart, i)));
    return [...set];
  }, [view, cursor, weekStart]);

  // New service means new durations, so start over.
  useEffect(() => {
    setCounts({});
    setLoaded({});
  }, [serviceSlug]);

  useEffect(() => {
    let cancelled = false;
    for (const month of needed) {
      if (loaded[month]) continue;
      fetch(`/api/availability/month?month=${month}&service=${encodeURIComponent(serviceSlug)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (cancelled) return;
          setCounts((c) => ({ ...c, ...data.days }));
          setLoaded((l) => ({ ...l, [month]: true }));
          setFailed(false);
        })
        .catch(() => !cancelled && setFailed(true));
    }
    return () => {
      cancelled = true;
    };
  }, [needed, serviceSlug, loaded]);

  const monthReady = needed.every((m) => loaded[m]);

  const step = (dir: 1 | -1) =>
    setCursor((c) => (view === "month" ? `${addMonths(monthOf(c), dir)}-01` : addDays(c, 7 * dir)));

  const canPrev = view === "month" ? monthOf(cursor) > monthOf(todayIso) : addDays(weekStart, -1) >= todayIso;
  const canNext = view === "month" ? addMonths(monthOf(cursor), 1) <= monthOf(lastDay) : addDays(weekStart, 7) <= lastDay;

  // Cells: month = full weeks around the month, week = 7 days.
  const cells = useMemo(() => {
    if (view === "week") return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const first = `${monthOf(cursor)}-01`;
    const start = addDays(first, -weekdayOf(first));
    const [y, m] = monthOf(cursor).split("-").map(Number);
    const total = Math.ceil((weekdayOf(first) + new Date(Date.UTC(y, m, 0)).getUTCDate()) / 7) * 7;
    return Array.from({ length: total }, (_, i) => addDays(start, i));
  }, [view, cursor, weekStart]);

  const title =
    view === "month"
      ? monthLabel(monthOf(cursor))
      : `${monthLabel(monthOf(weekStart)).split(" ")[0]} ${Number(weekStart.slice(8))} – ${Number(addDays(weekStart, 6).slice(8))}`;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={view === "month" ? "Previous month" : "Previous week"}
            disabled={!canPrev}
            onClick={() => step(-1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-white/70 hover:border-gold/50 disabled:opacity-25 disabled:hover:border-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={view === "month" ? "Next month" : "Next week"}
            disabled={!canNext}
            onClick={() => step(1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-white/70 hover:border-gold/50 disabled:opacity-25 disabled:hover:border-border"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-2xl font-light text-center flex-1" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h3>
        <div className="flex rounded-full border border-border overflow-hidden text-[11px] tracking-wider uppercase">
          {(["month", "week"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3.5 py-2.5 ${view === v ? "bg-gold/15 text-gold" : "text-white/50 hover:text-white"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] tracking-[0.18em] uppercase text-white/40 mb-1.5">
        {DOW.map((d) => (
          <div key={d} className="py-1.5">{d}</div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1.5 ${view === "week" ? "" : ""}`}>
        {cells.map((iso) => {
          const inMonth = view === "week" || monthOf(iso) === monthOf(cursor);
          const past = iso < todayIso;
          const beyond = iso > lastDay;
          const closedDay = closedWeekdays.includes(weekdayOf(iso));
          const known = loaded[monthOf(iso)];
          const n = counts[iso] ?? 0;
          const disabled = past || beyond || closedDay || (known && n === 0);
          const selected = selectedDate === iso;
          const today = iso === todayIso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-label={`${iso}${known && !disabled ? `, ${n} times open` : ""}`}
              aria-pressed={selected}
              onClick={() => onSelect(iso)}
              className={`relative flex flex-col items-center justify-center rounded-xl border text-sm transition-colors ${
                view === "week" ? "h-24" : "aspect-square sm:aspect-[5/4]"
              } ${
                selected
                  ? "bg-gold text-ink border-gold font-semibold"
                  : disabled
                  ? "border-transparent text-white/20 cursor-not-allowed"
                  : "border-border text-white/85 hover:border-gold/60"
              } ${!inMonth ? "opacity-0 pointer-events-none" : ""} ${today && !selected ? "ring-1 ring-gold/50" : ""}`}
            >
              <span>{Number(iso.slice(8))}</span>
              {!disabled && known && n > 0 && (
                view === "week" ? (
                  <span className={`text-[10px] mt-1 ${selected ? "text-ink/70" : "text-gold"}`}>{n} open</span>
                ) : (
                  <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${selected ? "bg-ink" : "bg-gold"}`} />
                )
              )}
              {!disabled && !known && !failed && <span className="text-[9px] text-white/20 mt-0.5">·</span>}
            </button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-white/40 mt-3 min-h-4" aria-live="polite">
        {failed ? "Couldn't load availability. Please refresh." : !monthReady ? "Loading availability…" : "Gold dot = times available"}
      </p>
    </div>
  );
}
