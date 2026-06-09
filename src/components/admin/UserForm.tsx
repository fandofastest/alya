"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function UserForm(props: {
  mode: "create" | "edit";
  id?: string;
  initial?: { nip: string; nama: string; isActive: boolean };
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    nip: props.initial?.nip ?? "",
    nama: props.initial?.nama ?? "",
    password: "",
    isActive: props.initial?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!values.nip.trim()) return setError("NIP wajib diisi.");
    if (!values.nama.trim()) return setError("Nama wajib diisi.");
    if (props.mode === "create" && values.password.length < 6) return setError("Password minimal 6 karakter.");
    if (props.mode === "edit" && values.password && values.password.length < 6) return setError("Password minimal 6 karakter.");

    setIsSubmitting(true);
    try {
      const endpoint = props.mode === "create" ? "/api/users" : `/api/users/${props.id}`;
      const method = props.mode === "create" ? "POST" : "PUT";
      const payload = {
        nip: values.nip.trim(),
        nama: values.nama.trim(),
        password: values.password ? values.password : undefined,
        isActive: values.isActive,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) throw new Error(data?.message ?? "Gagal menyimpan user.");

      toast.success(data?.message ?? "Berhasil.");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan user.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">NIP</label>
        <input
          type="text"
          value={values.nip}
          onChange={(e) => setValues({ ...values, nip: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#B91C1C] focus:outline-none"
          placeholder="Masukkan NIP"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Nama</label>
        <input
          type="text"
          value={values.nama}
          onChange={(e) => setValues({ ...values, nama: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#B91C1C] focus:outline-none"
          placeholder="Nama lengkap"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">
          Password {props.mode === "edit" ? "(Kosongkan jika tidak diubah)" : ""}
        </label>
        <input
          type="password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-[#B91C1C] focus:outline-none"
          placeholder="Minimal 6 karakter"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
          className="h-4 w-4"
        />
        <span className="font-semibold text-slate-700">Aktif</span>
      </label>

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
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
