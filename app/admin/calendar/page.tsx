import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { CalendarApp } from "@/components/admin/CalendarApp";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <CalendarApp feedUnprotected={!process.env.CALENDAR_FEED_TOKEN} />;
}
