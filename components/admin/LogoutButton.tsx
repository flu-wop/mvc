"use client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-grey hover:text-gold text-xs tracking-wide transition-colors shrink-0"
    >
      Log out
    </button>
  )
}
