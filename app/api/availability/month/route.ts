import { NextRequest, NextResponse } from "next/server";
import { monthAvailability } from "@/lib/availability";
import { getService } from "@/lib/services";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ok = await rateLimit(`availability-month:${clientIp(req)}`, 60, 600);
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const month = req.nextUrl.searchParams.get("month") || "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }
  const service = await getService(req.nextUrl.searchParams.get("service"));
  if (!service) return NextResponse.json({ error: "Invalid or missing service" }, { status: 400 });

  return NextResponse.json({ month, days: await monthAvailability(month, service.slug) });
}
