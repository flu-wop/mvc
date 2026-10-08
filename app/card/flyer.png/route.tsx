import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import sharp from "sharp";
import { qrDataUri } from "@/lib/qr";
import { displayFont } from "@/lib/og-font";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

// Margie's booking-page graphic (the one from her Acuity page) with a
// "scan to book" strip added underneath. Replace public/images/booking-page.png
// to update it; the strip regenerates from NEXT_PUBLIC_SITE_URL.
const FLYER = "/images/booking-page.png";
const WIDTH = 2000;
const BAND_HEIGHT = 760;

export async function GET(req: NextRequest) {
  const [flyerRes, qr, font] = await Promise.all([
    fetch(`${req.nextUrl.origin}${FLYER}`),
    qrDataUri(SITE_URL),
    displayFont(),
  ]);
  if (!flyerRes.ok) return new Response("Flyer not found", { status: 404 });
  const flyer = Buffer.from(await flyerRes.arrayBuffer());
  const meta = await sharp(flyer).metadata();
  const scale = WIDTH / (meta.width || WIDTH);
  const flyerHeight = Math.round((meta.height || 0) * scale);

  const host = SITE_URL.replace(/^https?:\/\//, "");
  const family = font ? "Cormorant" : "sans-serif";
  const band = new ImageResponse(
    (
      <div style={{ width: WIDTH, height: BAND_HEIGHT, display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0B0C", color: "#F2EDE4", fontFamily: family, gap: 120 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} width={460} height={460} alt="" style={{ borderRadius: 28 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 54, letterSpacing: 14, color: "#C9A96E" }}>SCAN TO BOOK</div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1.05, marginTop: 24 }}>Your chair</div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1.05, color: "#C9A96E", fontStyle: "italic" }}>is waiting.</div>
          <div style={{ display: "flex", fontSize: 64, marginTop: 36, color: "#B8BBC0" }}>{host}</div>
        </div>
      </div>
    ),
    { width: WIDTH, height: BAND_HEIGHT, fonts: font ? [{ name: "Cormorant", data: font, weight: 400, style: "normal" }] : undefined }
  );
  const bandBuf = Buffer.from(await band.arrayBuffer());

  const out = await sharp({ create: { width: WIDTH, height: flyerHeight + BAND_HEIGHT, channels: 3, background: "#0B0B0C" } })
    .composite([
      { input: await sharp(flyer).resize({ width: WIDTH }).toBuffer(), top: 0, left: 0 },
      { input: bandBuf, top: flyerHeight, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  const headers: Record<string, string> = { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" };
  if (req.nextUrl.searchParams.has("download")) headers["Content-Disposition"] = 'attachment; filename="mvc-creations-booking-page.png"';
  return new Response(new Uint8Array(out), { headers });
}
