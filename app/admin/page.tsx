// Admin home — last 30 days, what needs attention, appointments coming up and
// shortcuts to every section. The calendar lives at /admin/calendar.
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { isAdminAuthed } from "@/lib/admin-auth"
import { getDb, initDb } from "@/lib/db"
import { getDB } from "@/lib/insights/db"
import { getInsights } from "@/lib/insights/core"
import { insightsConfig } from "@/lib/insights/config"
import type { Insights } from "@/lib/insights/types"
import { nowInShop, parseTime } from "@/lib/time"
import { ADMIN_SECTIONS } from "@/components/admin/sections"
import { Stat, money, longDate } from "@/components/admin/insights-ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin", robots: { index: false } }

const DESCRIPTIONS: Record<string, string> = {
  "/admin/calendar": "Day and week view, add and move appointments",
  "/admin/clients": "Client list, history & notes",
  "/admin/services": "Menu, prices, durations & add-ons",
  "/admin/hours": "Opening hours & blocked time",
  "/admin/bookings": "Every booking as a list",
  "/admin/inquiries": "Content-creation inquiries",
  "/admin/insights": "Deposits, bookings, visitors & the booking funnel",
  "/admin/orders": "Shop orders",
  "/admin/system": "Env vars, integrations & health checks",
}

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "America/Chicago" }).format(new Date()))
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

type Appt = { id: number; name: string; service: string; day: string; time: string; status: string; deposit: number }
type Attn = { label: string; value: number; href: string }

export default async function AdminHome() {
  if (!(await isAdminAuthed())) redirect("/admin/login")

  const today = nowInShop().date

  let data: Insights | null = null
  let failed = false
  const idb = getDB()
  if (idb) {
    try { await initDb() } catch (err) { console.error("[admin home] initDb", err) }
    try { data = await getInsights(idb, insightsConfig, 30) } catch (err) { console.error("[admin home]", err); failed = true }
  }

  let appts: Appt[] = []
  const attention: Attn[] = []
  if (idb) {
    try {
      const db = getDb()
      const [up, inq] = await Promise.all([
        db.execute({ sql: "SELECT id, name, service, event_date, event_time, status, deposit_cents FROM bookings WHERE event_date >= ? AND status IN ('paid','pending') ORDER BY event_date ASC LIMIT 40", args: [today] }),
        db.execute("SELECT COUNT(*) AS n FROM content_inquiries WHERE status = 'new'"),
      ])
      appts = up.rows
        .map((r) => ({ id: Number(r.id), name: String(r.name), service: String(r.service), day: String(r.event_date), time: String(r.event_time), status: String(r.status), deposit: Number(r.deposit_cents) / 100 }))
        .sort((a, b) => a.day.localeCompare(b.day) || (parseTime(a.time) ?? 0) - (parseTime(b.time) ?? 0))
        .slice(0, 6)
      const n = Number(inq.rows[0]?.n ?? 0)
      if (n > 0) attention.push({ label: `new content inquir${n === 1 ? "y" : "ies"}`, value: n, href: "/admin/inquiries" })
    } catch (err) {
      console.error("[admin home] upcoming", err)
    }
  }
  for (const a of data?.attention ?? []) if (a.value > 0) attention.unshift({ label: a.label, value: a.value, href: "/admin/bookings" })

  const rev = data?.sources.find((s) => s.key === "revenue")
  const paid = data?.sources.find((s) => s.key === "sales")

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-1.5">{longDate(today)}</p>
        <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">{greeting()}, Margie</h1>
      </div>

      {attention.map((a) => (
        <p key={a.label} className="mb-4 text-sm text-red-300 border border-red-400/30 bg-red-400/5 px-4 py-3">
          {a.value} {a.label}. <Link href={a.href} className="underline">Review</Link>
        </p>
      ))}

      <section aria-label="Last 30 days" className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-grey">Last 30 days</h2>
          <Link href="/admin/insights" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
            All insights <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data && rev && paid ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Deposits" value={money(rev.total)} cur={rev.total} prev={rev.prev} />
            <Stat label="Paid bookings" value={String(paid.total)} cur={paid.total} prev={paid.prev} />
            <Stat label="Visitors" value={data.visitors.cur.toLocaleString("en-US")} cur={data.visitors.cur} prev={data.visitors.prev} />
            <Stat label="Page views" value={data.pageviews.cur.toLocaleString("en-US")} cur={data.pageviews.cur} prev={data.pageviews.prev} />
          </div>
        ) : (
          <p className="text-sm text-grey bg-card border border-border p-4">
            {failed || idb ? "Couldn’t load numbers right now. Sections below still work." : "Numbers need a database connection. Sections below still work."}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section aria-label="Coming up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-grey">Coming up</h2>
            <Link href="/admin/calendar" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
              Open calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-card border border-border">
            {appts.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-display text-xl text-white mb-1">Nothing booked yet</p>
                <p className="text-sm text-grey">Upcoming appointments show up here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {appts.map((a) => (
                  <li key={a.id}>
                    <Link href="/admin/calendar" className="flex gap-4 px-4 md:px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                      <div className="w-16 shrink-0">
                        <p className={`text-[10px] tracking-[0.14em] uppercase ${a.day === today ? "text-gold font-medium" : "text-grey"}`}>
                          {a.day === today ? "Today" : longDate(a.day).split(",")[0]}
                        </p>
                        <p className="text-sm text-white tabular-nums whitespace-nowrap">{a.time}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white font-medium truncate">{a.name}</p>
                        <p className="text-xs text-grey truncate">{a.service}</p>
                        <p className="text-[11px] text-grey/70 truncate">
                          {a.status === "paid" ? `Deposit paid · ${money(a.deposit)}` : "Deposit pending"} · {longDate(a.day)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-label="Sections">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-grey mb-3">Go to</h2>
          <div className="grid grid-cols-2 gap-3">
            {[...ADMIN_SECTIONS.filter((s) => s.href === "/admin/insights"), ...ADMIN_SECTIONS.filter((s) => s.href !== "/admin" && s.href !== "/admin/insights")].map(({ href, label, icon: Icon }) => {
              const hero = href === "/admin/insights"
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group border p-4 transition-colors min-w-0 hover:border-gold ${hero ? "col-span-2 bg-gold/10 border-border" : "bg-card border-border"}`}
                >
                  <Icon className="w-4 h-4 mb-3 text-gold" strokeWidth={1.6} aria-hidden />
                  <p className="font-display text-base leading-tight text-white">{label}</p>
                  <p className="text-xs mt-1 leading-snug text-grey">{DESCRIPTIONS[href]}</p>
                </Link>
              )
            })}
          </div>
          <Link href="/" className="mt-3 flex w-full items-center justify-center border border-border bg-card px-4 py-2.5 text-xs tracking-[0.18em] uppercase text-white hover:border-gold transition-colors">
            Open the site
          </Link>
        </section>
      </div>
    </main>
  )
}
