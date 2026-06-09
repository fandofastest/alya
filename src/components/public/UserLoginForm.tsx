"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserLoginForm(props: { nextUrl: string }) {
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
      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? "Login gagal.");
        return;
      }

      router.replace(props.nextUrl);
      router.refresh();
    } catch {
      setError("Login gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <img src="/logo.png" alt="Logo KPU" className="mb-4 h-16 w-auto" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Akses Dokumen</p>
        <h1 className="text-2xl font-black text-[#B91C1C]">Login User</h1>
        <p className="text-sm text-slate-600">Masuk untuk melihat dokumen yang bersifat private.</p>
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
            placeholder="user@kpu.go.id"
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
          className="w-full rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-60"
        >
          {isLoading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
