"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? "Login gagal.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Login gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Panel Administrasi</p>
        <h1 className="text-xl font-bold text-[#1E3A8A]">Login Admin</h1>
        <p className="text-sm text-slate-600">Masuk untuk mengelola PKPU dan file regulasi.</p>
      </div>

      {error ? <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="admin@kpu.go.id"
            required
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

