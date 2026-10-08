// Client-safe shapes shared by the admin API and the admin UI.

export type Appointment = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceSlug: string | null;
  date: string; // yyyy-mm-dd
  time: string; // "2:00 PM"
  startMin: number;
  durationMinutes: number;
  status: "pending" | "paid" | "completed" | "no_show" | "cancelled" | "needs_review" | string;
  depositCents: number;
  depositPaid: boolean;
  totalCents: number | null;
  fromCents: number;
  notes: string | null;
  message: string | null;
  clientId: number | null;
  source: string;
  color: string;
  createdAt: string | null;
  /** Paid online through Stripe, so the deposit can be refunded from admin. */
  stripeBacked: boolean;
  refundedAt: string | null;
};

export type ClientRow = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  visits: number;
  depositsCents: number;
  lastVisit: string | null;
  nextVisit: string | null;
};

export type ConflictInfo = { kind: string; message: string };
