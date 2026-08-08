import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import SystemDashboardClient from "./SystemDashboardClient";

export default async function SystemPage() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              MVC Creations · Admin
            </p>
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
              System Health
            </h1>
          </div>
          <Link href="/admin/orders" className="text-grey text-sm hover:text-gold transition-colors">
            ← Orders
          </Link>
        </div>
        <SystemDashboardClient />
      </div>
    </main>
  );
}
