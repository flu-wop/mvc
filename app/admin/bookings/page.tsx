import { redirect } from "next/navigation";
import { getDb, initDb } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminBookings() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM bookings ORDER BY event_date DESC, event_time DESC")).rows as any[];

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Bookings ({rows.length})
        </h1>
        <p className="text-grey text-xs mb-8">
          Subscribe to the live feed in Google/Apple Calendar:{" "}
          <span className="text-gold">/api/calendar.ics</span>
        </p>

        <div className="rounded-2xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-grey border-b border-border">
                <th className="px-4 py-3 font-medium">Date / Time</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Deposit</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Booked</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-grey">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border text-white/80 align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.event_date} {r.event_time}
                  </td>
                  <td className="px-4 py-3">{r.service}</td>
                  <td className="px-4 py-3">
                    <div>{r.name}</div>
                    <div className="text-xs text-grey">{r.email}</div>
                    <div className="text-xs text-grey">{r.phone}</div>
                    {r.message && <div className="text-xs text-grey mt-1 max-w-[220px]">{r.message}</div>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">${(r.deposit_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-white/5 border border-border">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-grey">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
