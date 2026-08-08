import { redirect } from "next/navigation";
import Link from "next/link";
import { getDb, initDb } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM orders ORDER BY created_at DESC")).rows as any[];

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              MVC Creations · Admin
            </p>
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
              Orders ({rows.length})
            </h1>
          </div>
          <Link href="/admin/system" className="text-grey text-sm hover:text-gold transition-colors">
            System Health →
          </Link>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-grey border-b border-border">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-grey">
                    No orders yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border text-white/80">
                  <td className="px-4 py-3 whitespace-nowrap">{r.created_at}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3 text-xs text-grey max-w-xs truncate">{r.items_json}</td>
                  <td className="px-4 py-3">${(r.amount_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === "paid"
                          ? "bg-gold/15 text-gold"
                          : "bg-white/10 text-grey"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
