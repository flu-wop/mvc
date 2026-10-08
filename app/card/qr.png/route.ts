import { NextRequest } from "next/server";
import { qrPng } from "@/lib/qr";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const headers: Record<string, string> = { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" };
  if (req.nextUrl.searchParams.has("download")) headers["Content-Disposition"] = 'attachment; filename="mvc-creations-qr.png"';
  return new Response(new Uint8Array(await qrPng(SITE_URL)), { headers });
}
