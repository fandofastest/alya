"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setError("Logout gagal. Silakan coba lagi.");
        return;
      }
      router.replace("/admin/login");
    } catch {
      setError("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:opacity-60"
      >
        {isLoading ? "Memproses..." : "Logout"}
      </button>
    </div>
  );
}

