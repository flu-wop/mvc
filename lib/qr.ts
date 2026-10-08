import QRCode from "qrcode";

// Dark modules on ivory: high contrast, scans reliably from a screen or print.
const COLORS = { dark: "#0B0B0C", light: "#F2EDE4" };

export function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M", color: COLORS });
}

export function qrPng(url: string, width = 1024): Promise<Buffer> {
  return QRCode.toBuffer(url, { type: "png", margin: 2, width, errorCorrectionLevel: "M", color: COLORS });
}

export function qrDataUri(url: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 2, width: 600, errorCorrectionLevel: "M", color: COLORS });
}
