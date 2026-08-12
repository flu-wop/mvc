import { NextRequest, NextResponse } from "next/server";
import { availableSlots, isClosedDate } from "@/lib/availability";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  if (isClosedDate(date)) {
    return NextResponse.json({ slots: [], closed: true });
  }

  const slots = await availableSlots(date);
  return NextResponse.json({ slots, closed: false });
}
