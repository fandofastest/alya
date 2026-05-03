"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PkpuDeleteButton(props: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm("Hapus PKPU ini?");
    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pkpu/${props.id}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? "Gagal menghapus PKPU.");
        return;
      }
      router.refresh();
    } catch {
      setError("Gagal menghapus PKPU.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
        className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-60"
      >
        {isLoading ? "Menghapus..." : "Hapus"}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

