"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserLogoutButton(props: { idleLabel: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/user/logout", { method: "POST" });
      router.refresh();
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:opacity-60"
    >
      {isLoading ? "..." : props.idleLabel}
    </button>
  );
}
