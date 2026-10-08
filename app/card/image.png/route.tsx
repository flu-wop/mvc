import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { qrDataUri } from "@/lib/qr";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

// The picture on the card. Swap this one file path to change it everywhere.
const CARD_IMAGE = "/images/service-gel-x.jpg";

let fontCache: ArrayBuffer | null | undefined;
async function displayFont(): Promise<ArrayBuffer | null> {
  if (fontCache !== undefined) return fontCache;
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400", {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1" },
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    fontCache = url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    fontCache = null;
  }
  return fontCache;
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const [qr, font] = await Promise.all([qrDataUri(SITE_URL), displayFont()]);
  const family = font ? "Cormorant" : "sans-serif";
  const host = SITE_URL.replace(/^https?:\/\//, "");

  const res = new ImageResponse(
    (
      <div style={{ width: 1080, height: 1350, display: "flex", position: "relative", background: "#0B0B0C", color: "#F2EDE4", fontFamily: family }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${origin}${CARD_IMAGE}`} width={1080} height={1350} style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1350, objectFit: "cover" }} alt="" />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1350, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(11,11,12,0.45), rgba(11,11,12,0.05) 30%, rgba(11,11,12,0.35) 55%, rgba(11,11,12,0.96) 85%)" }} />
        <div style={{ position: "absolute", top: 80, left: 80, display: "flex", fontSize: 26, letterSpacing: 8, color: "#C9A96E" }}>
          {BUSINESS.name.toUpperCase()}
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: 80, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 108, lineHeight: 1, fontWeight: 400 }}>Your chair</div>
            <div style={{ display: "flex", fontSize: 108, lineHeight: 1, fontWeight: 400, color: "#C9A96E", fontStyle: "italic" }}>is waiting.</div>
            <div style={{ display: "flex", fontSize: 30, marginTop: 36, color: "#B8BBC0", letterSpacing: 2 }}>Kenner, Louisiana · By appointment</div>
            <div style={{ display: "flex", fontSize: 34, marginTop: 14, color: "#F2EDE4", letterSpacing: 1 }}>{host}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={260} height={260} alt="" style={{ borderRadius: 18 }} />
            <div style={{ display: "flex", fontSize: 22, marginTop: 16, letterSpacing: 6, color: "#C9A96E" }}>SCAN TO BOOK</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: font ? [{ name: "Cormorant", data: font, weight: 400, style: "normal" }] : undefined,
    }
  );

  res.headers.set("Cache-Control", "public, max-age=3600");
  if (req.nextUrl.searchParams.has("download")) res.headers.set("Content-Disposition", 'attachment; filename="mvc-creations-booking-card.png"');
  return res;
}
