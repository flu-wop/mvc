// Plain module (no "use client") so server-rendered pages can read the list.
import { Package, CalendarDays, Calendar, Users, Scissors, Clock, Mail, Activity, BarChart3, Home } from "lucide-react"
import { SHOP_ENABLED } from "@/lib/features"

export const ADMIN_SECTIONS = [
  { href: "/admin",           icon: Home,         label: "Home" },
  { href: "/admin/calendar",  icon: CalendarDays, label: "Calendar" },
  { href: "/admin/clients",   icon: Users,        label: "Clients" },
  { href: "/admin/services",  icon: Scissors,     label: "Services" },
  { href: "/admin/hours",     icon: Clock,        label: "Hours" },
  { href: "/admin/bookings",  icon: Calendar,     label: "List" },
  { href: "/admin/inquiries", icon: Mail,         label: "Inquiries" },
  { href: "/admin/insights",  icon: BarChart3,    label: "Insights" },
  ...(SHOP_ENABLED ? [{ href: "/admin/orders", icon: Package, label: "Orders" }] : []),
  { href: "/admin/system",    icon: Activity,     label: "System" },
]
