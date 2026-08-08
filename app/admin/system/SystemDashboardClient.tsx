"use client";

import { useState, useEffect, useCallback } from "react";

type CheckResult = { status: "ok" | "warn" | "error"; detail: string };
type HealthData = {
  envVars: Record<string, CheckResult>;
  webhookHealth: { stripe: CheckResult; lastOrder: CheckResult; turso: CheckResult };
  apiUsage: CheckResult;
  checkedAt: string;
};

const STATUS_DOT: Record<string, string> = {
  ok: "bg-green-400",
  warn: "bg-yellow-400",
  error: "bg-red-400",
};

function Pill({ status }: { status: "ok" | "warn" | "error" }) {
  return <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 shrink-0 ${STATUS_DOT[status]}`} />;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white/[0.02] p-5">
      <h3 className="text-gold text-base font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SystemDashboardClient() {
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState("");

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) {
        setError("Could not load health data");
        return;
      }
      setData(await res.json());
      setError("");
    } catch {
      setError("Could not load health data");
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!data) return <p className="text-grey text-sm">Loading…</p>;

  return (
    <>
      <p className="text-grey text-xs mb-6">
        Last checked {new Date(data.checkedAt).toLocaleTimeString()} — refreshes every 60s
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        <Card title="Env Vars">
          {Object.entries(data.envVars).map(([key, r]) => (
            <div key={key} className="flex items-center text-sm text-white/75 mb-1.5">
              <Pill status={r.status} /> {key} — {r.detail}
            </div>
          ))}
        </Card>

        <Card title="Webhook Health">
          {Object.entries(data.webhookHealth).map(([key, r]) => (
            <div key={key} className="flex items-center text-sm text-white/75 mb-1.5">
              <Pill status={r.status} /> {key} — {r.detail}
            </div>
          ))}
        </Card>

        <Card title="API Usage">
          <div className="flex items-center text-sm text-white/75">
            <Pill status={data.apiUsage.status} /> {data.apiUsage.detail}
          </div>
        </Card>
      </div>
    </>
  );
}
