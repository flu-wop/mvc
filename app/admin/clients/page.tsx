import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
import { ClientsApp } from "@/components/admin/ClientsApp";

export default async function Page() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  return <ClientsApp />;
}
