import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import SystemDashboardClient from "./SystemDashboardClient";

export default async function SystemPage() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
          System Health
        </h1>
        <SystemDashboardClient />
      </div>
    </main>
  );
}
