"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function KategoriForm(props: {
  mode: "create" | "edit";
  id?: string;
  initial?: { nama: string; deskripsi: string };
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    nama: props.initial?.nama ?? "",
    deskripsi: props.initial?.deskripsi ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.nama.trim()) return setError("Nama kategori wajib diisi.");

    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = props.mode === "create" ? "/api/kategori" : `/api/kategori/${props.id}`;
      const method = props.mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan kategori.");

      toast.success(data.message);
      router.push("/admin/kategori");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Nama Kategori</label>
        <input
          type="text"
          value={values.nama}
          onChange={(e) => setValues({ ...values, nama: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#B91C1C] focus:outline-none"
          placeholder="Misal: Peraturan Komisi"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Deskripsi (Opsional)</label>
        <textarea
          value={values.deskripsi}
          onChange={(e) => setValues({ ...values, deskripsi: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#B91C1C] focus:outline-none"
          rows={4}
          placeholder="Keterangan singkat kategori ini..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
        </button>
      </div>
    </form>
  );
}
