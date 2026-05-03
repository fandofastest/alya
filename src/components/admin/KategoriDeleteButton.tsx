"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function KategoriDeleteButton({ id, nama }: { id: string; nama: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kategori/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal menghapus kategori.");

      toast.success(data.message);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
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
