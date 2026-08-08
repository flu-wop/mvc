import { NextResponse } from "next/server";
import { checkEnvVars, checkStripe, checkLastOrder, checkTurso, checkApiUsage } from "@/lib/health-checks";
import { isAdminAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [envVars, stripe, lastOrder, turso, apiUsage] = await Promise.all([
    Promise.resolve(checkEnvVars()),
    checkStripe(),
    checkLastOrder(),
    checkTurso(),
    checkApiUsage(),
  ]);

  return NextResponse.json({
    envVars,
    webhookHealth: { stripe, lastOrder, turso },
    apiUsage,
    checkedAt: new Date().toISOString(),
  });
}
