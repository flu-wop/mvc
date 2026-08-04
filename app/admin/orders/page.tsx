import { getDb, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const params = await searchParams;
  if (params.key !== process.env.ADMIN_PASSWORD) {
    return <main style={{ padding: 40, fontFamily: "system-ui" }}>Unauthorized. Append <code>?key=YOUR_PASSWORD</code>.</main>;
  }
  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM orders ORDER BY created_at DESC")).rows as any[];
  return (
    <main style={{ padding: 40, fontFamily: "system-ui", color: "#F5F5F3", background: "#0A0A0A", minHeight: "100vh" }}>
      <h1 style={{ color: "#C9A356" }}>Orders ({rows.length})</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead><tr style={{ textAlign: "left", color: "#9A9A9A" }}>
          <th>Date</th><th>Email</th><th>Items</th><th>Total</th><th>Status</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #2A2A2A" }}>
              <td>{r.created_at}</td>
              <td>{r.email}</td>
              <td>{r.items_json}</td>
              <td>${(r.amount_cents / 100).toFixed(2)}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
