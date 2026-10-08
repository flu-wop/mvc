"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Package, Calendar, CalendarDays, Users, Scissors, Clock, Mail, Activity } from "lucide-react"
import { SHOP_ENABLED } from "@/lib/features"
import { LogoutButton } from "./LogoutButton"

const SECTIONS = [
  { href: "/admin",           icon: CalendarDays, label: "Calendar", exact: true },
  { href: "/admin/clients",   icon: Users,    label: "Clients" },
  { href: "/admin/services",  icon: Scissors, label: "Services" },
  { href: "/admin/hours",     icon: Clock,    label: "Hours" },
  { href: "/admin/bookings",  icon: Calendar, label: "List" },
  { href: "/admin/inquiries", icon: Mail,     label: "Inquiries" },
  ...(SHOP_ENABLED ? [{ href: "/admin/orders", icon: Package, label: "Orders" }] : []),
  { href: "/admin/system",    icon: Activity, label: "System" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-ink">
      <div className="sticky top-0 z-20 border-b border-border bg-ink/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase shrink-0">
            MVC Creations
          </p>
          <nav className="order-3 md:order-none w-full md:w-auto flex items-center gap-1 overflow-x-auto">
            {SECTIONS.map(({ href, icon: Icon, label, ...rest }) => {
              const exact = "exact" in rest
              const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-wide whitespace-nowrap transition-colors ${
                    active ? "bg-gold/15 text-gold" : "text-grey hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  )
}
