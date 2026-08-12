import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const PROJECT_TYPES = [
  "UGC Video",
  "Instagram Reels",
  "TikTok Content",
  "Photography",
  "Event Coverage",
  "Brand Partnership",
];

const BUDGET_RANGES = ["Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+", "Let's discuss"];

const TIMELINES = ["ASAP", "Within a month", "1–3 months", "Just exploring"];

function isNonEmptyString(v: unknown, maxLen: number) {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

export async function POST(req: NextRequest) {
  const ok = await rateLimit(`inquiries:${clientIp(req)}`, 5, 600); // 5 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const {
    businessName,
    contactName,
    email,
    phone,
    businessType,
    projectTypes,
    budgetRange,
    timeline,
    instagramOrSite,
    details,
  } = body;

  if (!isNonEmptyString(businessName, 200) || !isNonEmptyString(contactName, 200)) {
    return NextResponse.json({ error: "Business and contact name are required" }, { status: 400 });
  }
  if (typeof email !== "string" || email.length > 200 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!Array.isArray(projectTypes) || projectTypes.length === 0 || !projectTypes.every((t) => PROJECT_TYPES.includes(t))) {
    return NextResponse.json({ error: "Select at least one project type" }, { status: 400 });
  }
  if (budgetRange && !BUDGET_RANGES.includes(budgetRange)) {
    return NextResponse.json({ error: "Invalid budget range" }, { status: 400 });
  }
  if (timeline && !TIMELINES.includes(timeline)) {
    return NextResponse.json({ error: "Invalid timeline" }, { status: 400 });
  }
  if (phone && (typeof phone !== "string" || phone.length > 40)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  if (details && (typeof details !== "string" || details.length > 2000)) {
    return NextResponse.json({ error: "Details too long" }, { status: 400 });
  }

  try {
    await initDb();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO content_inquiries
        (business_name, contact_name, email, phone, business_type, project_types, budget_range, timeline, instagram_or_site, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        businessName.trim(),
        contactName.trim(),
        email.trim(),
        phone?.trim() || null,
        businessType?.trim()?.slice(0, 200) || null,
        JSON.stringify(projectTypes),
        budgetRange || null,
        timeline || null,
        instagramOrSite?.trim()?.slice(0, 300) || null,
        details?.trim() || null,
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("content inquiry submission failed", err);
    return NextResponse.json({ error: "Could not submit inquiry" }, { status: 500 });
  }
}
