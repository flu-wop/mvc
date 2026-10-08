import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
import { HoursApp } from "@/components/admin/HoursApp";

export default async function Page() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <HoursApp />;
}
