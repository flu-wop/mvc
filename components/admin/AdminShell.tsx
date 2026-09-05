"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Package, Calendar, Mail, Activity } from "lucide-react"
import { LogoutButton } from "./LogoutButton"

const SECTIONS = [
  { href: "/admin/orders",    icon: Package,  label: "Orders" },
  { href: "/admin/bookings",  icon: Calendar, label: "Bookings" },
  { href: "/admin/inquiries", icon: Mail,     label: "Inquiries" },
  { href: "/admin/system",    icon: Activity, label: "System" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-ink">
      <div className="sticky top-0 z-20 border-b border-border bg-ink/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-3 flex items-center justify-between gap-4">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase shrink-0">
            MVC Creations
          </p>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {SECTIONS.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/")
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
