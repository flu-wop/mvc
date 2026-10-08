import { NextRequest } from "next/server";
import { qrSvg } from "@/lib/qr";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const headers: Record<string, string> = { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" };
  if (req.nextUrl.searchParams.has("download")) headers["Content-Disposition"] = 'attachment; filename="mvc-creations-qr.svg"';
  return new Response(await qrSvg(SITE_URL), { headers });
}
