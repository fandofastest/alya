"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getDictionary, type Locale } from "@/lib/i18n";

export function UserLoginForm(props: { nextUrl: string; locale: Locale }) {
  const router = useRouter();
  const t = getDictionary(props.locale);

  const [nip, setNip] = useState("");
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
        body: JSON.stringify({ nip, password }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? t.login.loginFailed);
        return;
      }

      router.replace(props.nextUrl);
      router.refresh();
    } catch {
      setError(t.login.loginFailed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <img src="/logo.png" alt="Logo KPU" className="mb-4 h-16 w-auto" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Akses Dokumen</p>
        <h1 className="text-2xl font-black text-[#B91C1C]">{t.login.userTitle}</h1>
        <p className="text-sm text-slate-600">{t.login.userSubtitle}</p>
      </div>

      {error ? <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.login.nip}</span>
          <input
            type="text"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder={t.login.nipPlaceholder}
            required
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.login.password}</span>
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
          {isLoading ? t.common.loading : t.login.loginButton}
        </button>
      </form>
    </div>
  );
}
