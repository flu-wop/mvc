import { NextRequest, NextResponse } from "next/server";
import { availableSlots } from "@/lib/availability";
import { calcBooking, isCalcError } from "@/lib/booking-calc";
import { isIsoDate } from "@/lib/time";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ok = await rateLimit(`availability:${clientIp(req)}`, 120, 600); // 120 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const date = req.nextUrl.searchParams.get("date");
  const serviceSlug = req.nextUrl.searchParams.get("service");
  if (!isIsoDate(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }
  const calc = await calcBooking({ serviceSlug, addonIds: req.nextUrl.searchParams.get("addons") });
  if (isCalcError(calc)) return NextResponse.json({ error: calc.error }, { status: 400 });

  const { slots, closed, reason } = await availableSlots(date, calc.timing);
  return NextResponse.json({ slots, closed, reason: reason ?? null, durationMinutes: calc.timing.duration });
}
