import { NextResponse } from "next/server";
import { checkEnvVars, checkStripe, checkLastBooking, checkLastOrder, checkTurso, checkApiUsage, webhookUrl } from "@/lib/health-checks";
import { isAdminAuthed } from "@/lib/admin-auth";
import { SHOP_ENABLED } from "@/lib/features";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [envVars, stripe, lastBooking, lastOrder, turso, apiUsage] = await Promise.all([
    Promise.resolve(checkEnvVars()),
    checkStripe(),
    checkLastBooking(),
    checkLastOrder(),
    checkTurso(),
    checkApiUsage(),
  ]);

  return NextResponse.json({
    envVars,
    webhookHealth: { stripe, webhookUrl: webhookUrl(), lastBooking, ...(SHOP_ENABLED ? { lastOrder } : {}), turso },
    apiUsage,
    checkedAt: new Date().toISOString(),
  });
}
