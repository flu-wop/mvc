"use client"
// Standard admin frame: sticky header (brand, View site, Log out) with a
// filled-tab section row beneath it. Same structure as the other sites' admin.
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ADMIN_SECTIONS } from "./sections"
import { LogoutButton } from "./LogoutButton"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" })
  }, [pathname])

  if (pathname === "/admin/login") return <>{children}</>

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"))

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-20 border-b border-border bg-ink/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="h-12 flex items-center justify-between gap-3">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase truncate">
              MVC Creations <span className="text-grey font-normal ml-1.5">Admin</span>
            </p>
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/" className="text-grey hover:text-white text-xs tracking-wide transition-colors">View site</Link>
              <LogoutButton />
            </div>
          </div>
          <div className="relative -mx-4 md:mx-0">
            <nav aria-label="Admin sections" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 md:px-0 pb-3">
              {ADMIN_SECTIONS.map(({ href, icon: Icon, label }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    ref={active ? activeRef : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs tracking-wide whitespace-nowrap shrink-0 transition-colors ${
                      active ? "bg-gold text-ink font-semibold" : "text-grey hover:text-white hover:bg-card"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-ink to-transparent md:hidden" />
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
