import { getDb } from "@/lib/db";
import Stripe from "stripe";

export type CheckResult = { status: "ok" | "warn" | "error"; detail: string };

// ---- 1. Env Var Status ----
const REQUIRED_ENV_VARS = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_SITE_URL",
  // RESEND_API_KEY intentionally not required yet — order confirmation emails
  // aren't wired up (see TODO in app/api/stripe/webhook/route.ts)
];

export function checkEnvVars(): Record<string, CheckResult> {
  const results: Record<string, CheckResult> = {};
  for (const key of REQUIRED_ENV_VARS) {
    const present = !!process.env[key];
    results[key] = { status: present ? "ok" : "error", detail: present ? "set" : "MISSING" };
  }
  return results;
}

// ---- 2. Webhook Health ----
export async function checkStripe(): Promise<CheckResult> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 });
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const match = endpoints.data.find((e) => e.url.includes(site.replace(/^https?:\/\//, "")));
    if (!match) return { status: "warn", detail: "No webhook endpoint found for this site's URL" };
    if (match.status !== "enabled") return { status: "error", detail: `Endpoint status: ${match.status}` };
    return { status: "ok", detail: `Enabled, listening for: ${match.enabled_events.slice(0, 3).join(", ")}` };
  } catch (err) {
    return { status: "error", detail: `Stripe API error: ${(err as Error).message}` };
  }
}

export async function checkLastOrder(): Promise<CheckResult> {
  try {
    const db = getDb();
    const result = await db.execute("SELECT created_at FROM orders ORDER BY created_at DESC LIMIT 1");
    if (result.rows.length === 0) return { status: "warn", detail: "No orders yet" };
    const last = new Date(result.rows[0].created_at as string);
    const hoursAgo = (Date.now() - last.getTime()) / 3_600_000;
    if (hoursAgo > 24 * 14) return { status: "warn", detail: `Last order ${Math.round(hoursAgo / 24)} days ago` };
    return { status: "ok", detail: `Last order ${last.toLocaleString()}` };
  } catch (err) {
    return { status: "error", detail: `DB read failed: ${(err as Error).message}` };
  }
}

export async function checkTurso(): Promise<CheckResult> {
  try {
    const db = getDb();
    await db.execute("SELECT 1");
    return { status: "ok", detail: "Connected" };
  } catch (err) {
    return { status: "error", detail: `Turso connection failed: ${(err as Error).message}` };
  }
}

// ---- 3. API Usage (self-tracked; no api_calls writes exist yet, so this
// will read "not set up" until a provider call starts logging to it) ----
export async function checkApiUsage(): Promise<CheckResult> {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT provider, COUNT(*) as count FROM api_calls WHERE created_at > datetime('now', '-30 days') GROUP BY provider"
    );
    const summary = result.rows.map((r) => `${r.provider}: ${r.count}`).join(", ") || "No calls logged yet";
    return { status: "ok", detail: summary };
  } catch {
    return { status: "warn", detail: "api_calls table not set up yet — usage tracking inactive" };
  }
}
