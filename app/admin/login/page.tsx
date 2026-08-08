"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-center">
          MVC Creations
        </p>
        <h1 className="text-white text-2xl font-semibold text-center mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
          Admin Access
        </h1>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3 rounded-full bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/50 mb-4"
          autoFocus
        />
        {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-7 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
