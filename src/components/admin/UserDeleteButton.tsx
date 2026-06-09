"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function UserDeleteButton({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${email}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) throw new Error(data?.message ?? "Gagal menghapus user.");
      toast.success(data?.message ?? "User berhasil dihapus.");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menghapus user.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}
