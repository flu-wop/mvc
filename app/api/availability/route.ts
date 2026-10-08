import { NextRequest, NextResponse } from "next/server";
import { availableSlots } from "@/lib/availability";
import { getService } from "@/lib/services";
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
  const service = await getService(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Invalid or missing service" }, { status: 400 });
  }

  const { slots, closed, reason } = await availableSlots(date, service.slug);
  return NextResponse.json({ slots, closed, reason: reason ?? null, durationMinutes: service.durationMinutes });
}
