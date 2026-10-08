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
];

// Nothing breaks without these, but booking emails, reminders and the calendar
// feed's privacy depend on them.
const RECOMMENDED_ENV_VARS = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_TO_EMAIL", "CALENDAR_FEED_TOKEN", "CRON_SECRET"];

export function checkEnvVars(): Record<string, CheckResult> {
  const results: Record<string, CheckResult> = {};
  for (const key of REQUIRED_ENV_VARS) {
    const present = !!process.env[key];
    results[key] = { status: present ? "ok" : "error", detail: present ? "set" : "MISSING" };
  }
  for (const key of RECOMMENDED_ENV_VARS) {
    const present = !!process.env[key];
    results[key] = { status: present ? "ok" : "warn", detail: present ? "set" : "not set" };
  }
  const sk = process.env.STRIPE_SECRET_KEY || "";
  if (sk) {
    results.STRIPE_SECRET_KEY = sk.startsWith("sk_live_")
      ? { status: "ok", detail: "set (LIVE mode)" }
      : sk.startsWith("sk_test_")
      ? { status: "warn", detail: "set (TEST mode, no real money moves)" }
      : { status: "error", detail: "set but doesn't look like a Stripe secret key" };
  }
  const wh = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (wh && !wh.startsWith("whsec_")) results.STRIPE_WEBHOOK_SECRET = { status: "error", detail: "should start with whsec_" };
  return results;
}

// ---- 2. Webhook Health ----
export async function checkStripe(): Promise<CheckResult> {
  if (!process.env.STRIPE_SECRET_KEY) return { status: "error", detail: "STRIPE_SECRET_KEY missing" };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });
    const host = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^https?:\/\//, "");
    const match = host ? endpoints.data.find((e) => e.url.includes(host) && e.url.endsWith("/api/stripe/webhook")) : undefined;
    if (!match) return { status: "warn", detail: `No endpoint for ${host || "this site"}/api/stripe/webhook in this Stripe mode` };
    if (match.status !== "enabled") return { status: "error", detail: `Endpoint status: ${match.status}` };
    const events = match.enabled_events as string[];
    if (!events.includes("*") && !events.includes("checkout.session.completed")) {
      return { status: "error", detail: "Endpoint isn't listening for checkout.session.completed" };
    }
    return { status: "ok", detail: "Endpoint enabled and listening for checkout.session.completed" };
  } catch (err) {
    return { status: "error", detail: `Stripe API error: ${(err as Error).message}` };
  }
}

export function webhookUrl(): CheckResult {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  return { status: site ? "ok" : "warn", detail: site ? `${site}/api/stripe/webhook` : "Set NEXT_PUBLIC_SITE_URL first" };
}

export async function checkLastBooking(): Promise<CheckResult> {
  try {
    const result = await getDb().execute(
      "SELECT created_at, status FROM bookings WHERE source = 'online' ORDER BY id DESC LIMIT 1"
    );
    if (result.rows.length === 0) return { status: "warn", detail: "No online bookings yet" };
    const stuck = await getDb().execute("SELECT COUNT(*) AS n FROM bookings WHERE status = 'needs_review'");
    const n = Number(stuck.rows[0].n);
    return n > 0
      ? { status: "warn", detail: `${n} booking${n === 1 ? "" : "s"} need review on the calendar` }
      : { status: "ok", detail: `Last online booking ${result.rows[0].created_at} UTC` };
  } catch (err) {
    return { status: "error", detail: `DB read failed: ${(err as Error).message}` };
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
