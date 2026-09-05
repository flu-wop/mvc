import { redirect } from "next/navigation";
import { getDb, initDb } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminInquiries() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM content_inquiries ORDER BY created_at DESC")).rows as any[];

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
          Content Inquiries ({rows.length})
        </h1>

        <div className="rounded-2xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-grey border-b border-border">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Timeline</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-grey">
                    No inquiries yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                let types: string[] = [];
                try { types = JSON.parse(r.project_types); } catch {}
                return (
                  <tr key={r.id} className="border-t border-border text-white/80 align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{r.created_at}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{r.business_name}</div>
                      <div className="text-xs text-grey">{r.business_type || "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{r.contact_name}</div>
                      <div className="text-xs text-grey">{r.email}</div>
                      {r.phone && <div className="text-xs text-grey">{r.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[220px]">
                      {types.join(", ")}
                      {r.details && <div className="text-grey mt-1 line-clamp-3">{r.details}</div>}
                      {r.instagram_or_site && <div className="text-gold mt-1">{r.instagram_or_site}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.budget_range || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.timeline || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-white/5 border border-border">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
