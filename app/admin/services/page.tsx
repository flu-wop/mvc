import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
import { ServicesApp } from "@/components/admin/ServicesApp";

export default async function Page() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <ServicesApp />;
}
