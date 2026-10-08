import { NextResponse } from "next/server";
import { getDb, initDb } from "./db";
import { getServices } from "./services";
import { FALLBACK_DURATION_MINUTES } from "./service-defaults";
import { parseTime } from "./time";
import type { Appointment } from "./admin-types";

export function bad(message: string, status = 400, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function readJson(req: Request): Promise<Record<string, any> | null> {
  const body = await req.json().catch(() => null);
  return body && typeof body === "object" ? body : null;
}

export function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length <= max ? t : null;
}

// Rows -> Appointment, colored by service. Joins in memory against the
// service list (a handful of rows) instead of in SQL.
export async function mapAppointments(rows: any[]): Promise<Appointment[]> {
  const services = await getServices({ includeInactive: true });
  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const byTitle = new Map(services.map((s) => [s.title.toLowerCase(), s]));
  return rows.map((r) => {
    const svc = (r.service_slug && bySlug.get(String(r.service_slug))) || byTitle.get(String(r.service).toLowerCase());
    const status = String(r.status);
    return {
      id: Number(r.id),
      name: String(r.name),
      email: String(r.email ?? ""),
      phone: String(r.phone ?? ""),
      service: String(r.service),
      serviceSlug: r.service_slug ? String(r.service_slug) : svc?.slug ?? null,
      date: String(r.event_date),
      time: String(r.event_time),
      startMin: parseTime(String(r.event_time)) ?? 0,
      durationMinutes: Number(r.duration_minutes) || svc?.durationMinutes || FALLBACK_DURATION_MINUTES,
      status,
      depositCents: Number(r.deposit_cents) || 0,
      depositPaid: status !== "pending" && status !== "cancelled",
      totalCents: r.total_cents == null ? null : Number(r.total_cents),
      fromCents: Number(r.service_from_cents) || 0,
      notes: r.notes == null ? null : String(r.notes),
      message: r.message == null ? null : String(r.message),
      clientId: r.client_id == null ? null : Number(r.client_id),
      source: String(r.source ?? "online"),
      color: svc?.color ?? "#C9A96E",
      createdAt: r.created_at == null ? null : String(r.created_at),
      stripeBacked: !!r.stripe_session_id,
      refundedAt: r.refunded_at == null ? null : String(r.refunded_at),
    };
  });
}

export async function getAppointment(id: number): Promise<Appointment | null> {
  await initDb();
  const rows = (await getDb().execute({ sql: `SELECT * FROM bookings WHERE id = ?`, args: [id] })).rows;
  if (!rows.length) return null;
  return (await mapAppointments(rows))[0];
}

export function isUniqueViolation(err: unknown) {
  return /UNIQUE|constraint/i.test(String((err as any)?.message ?? err));
}
