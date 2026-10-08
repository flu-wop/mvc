import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
import { ClientDetail } from "@/components/admin/ClientDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const { id } = await params;
  return <ClientDetail id={Number(id)} />;
}
