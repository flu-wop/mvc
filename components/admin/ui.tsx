"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export async function api<T = any>(url: string, init?: { method?: string; body?: unknown }): Promise<{ ok: boolean; status: number; data: T & { error?: string; conflicts?: { kind: string; message: string }[] } }> {
  try {
    const res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    if (res.status === 401) {
      window.location.href = "/admin/login";
    }
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Can't reach the server. Check your connection." } as any };
  }
}

export const inputCls =
  "w-full rounded-xl bg-charcoal border border-border px-3 py-2.5 text-sm text-white placeholder:text-grey/60 focus:outline-none focus:border-gold/60";
export const labelCls = "block text-[11px] tracking-[0.14em] uppercase text-grey mb-1.5";
export const btnGold =
  "rounded-full bg-gold text-ink px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50";
export const btnGhost =
  "rounded-full border border-border text-white/80 px-4 py-2.5 text-xs tracking-wide hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-50";

export function SlideOver({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside
        role="dialog"
        aria-label={title}
        className="relative w-full sm:max-w-md h-full bg-card border-l border-border overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card/95 backdrop-blur border-b border-border px-5 py-4">
          <h2 className="text-white text-lg" style={{ fontFamily: "var(--font-playfair)" }}>{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-grey hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 pb-16 space-y-5">{children}</div>
      </aside>
    </div>
  );
}

export function Notice({ kind = "error", children }: { kind?: "error" | "warn" | "ok"; children: React.ReactNode }) {
  const c = kind === "error" ? "border-red-500/40 text-red-300" : kind === "warn" ? "border-gold/40 text-gold" : "border-emerald-500/40 text-emerald-300";
  return <div className={`rounded-xl border ${c} bg-black/20 px-3 py-2.5 text-sm`}>{children}</div>;
}

export function toInputTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}
export function fromInputTime(v: string): number | null {
  const m = v.match(/^(\d{2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
export const money = (c: number) => `$${(c / 100).toFixed(c % 100 ? 2 : 0)}`;
