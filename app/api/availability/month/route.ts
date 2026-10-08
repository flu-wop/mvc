import { NextRequest, NextResponse } from "next/server";
import { monthAvailability } from "@/lib/availability";
import { calcBooking, isCalcError } from "@/lib/booking-calc";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ok = await rateLimit(`availability-month:${clientIp(req)}`, 60, 600);
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const month = req.nextUrl.searchParams.get("month") || "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }
  const calc = await calcBooking({
    serviceSlug: req.nextUrl.searchParams.get("service"),
    addonIds: req.nextUrl.searchParams.get("addons"),
  });
  if (isCalcError(calc)) return NextResponse.json({ error: calc.error }, { status: 400 });

  return NextResponse.json({ month, days: await monthAvailability(month, calc.timing) });
}
