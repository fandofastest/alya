"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { StatusHukum } from "@/lib/types";

type KategoriOption = { _id: string; nama: string };
type IndukOption = { _id: string; nomor: number; tahun: number; judul: string };

type PkpuFormValues = {
  nomor: number;
  tahun: number;
  judul: string;
  tanggalPenetapan: string;
  statusHukum: StatusHukum;
  kategori: string;
  parentId: string | null;
  isActive: boolean;
  fileUrl: string;
};

type PkpuFormInitial = Partial<Omit<PkpuFormValues, "tanggalPenetapan">> & {
  tanggalPenetapan?: Date | string;
};

function toDateInputValue(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function PkpuForm(props: {
  mode: "create" | "edit";
  pkpuId?: string;
  storageConfig: {
    driver: string;
    externalUrl?: string;
    externalToken?: string;
  };
  kategoriOptions: KategoriOption[];
  indukOptions: IndukOption[];
  initial?: PkpuFormInitial;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PkpuFormValues>(() => ({
    nomor: props.initial?.nomor ?? 1,
    tahun: props.initial?.tahun ?? new Date().getFullYear(),
    judul: props.initial?.judul ?? "",
    tanggalPenetapan: props.initial?.tanggalPenetapan
      ? toDateInputValue(props.initial.tanggalPenetapan)
      : toDateInputValue(new Date()),
    statusHukum: props.initial?.statusHukum ?? "berlaku",
    kategori: props.initial?.kategori ?? (props.kategoriOptions[0]?._id ?? ""),
    parentId: props.initial?.parentId ?? null,
    isActive: props.initial?.isActive ?? true,
    fileUrl: props.initial?.fileUrl ?? "",
  }));
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredIndukOptions = useMemo(() => props.indukOptions, [props.indukOptions]);

  function update<K extends keyof PkpuFormValues>(key: K, value: PkpuFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

    if (!pdfFile) return values.fileUrl;
    const formData = new FormData();
    formData.set("file", pdfFile);
    formData.set("nomor", String(values.nomor));
    formData.set("tahun", String(values.tahun));
    formData.set("judul", values.judul);
    formData.set("tanggalPenetapan", values.tanggalPenetapan);

    // Direct upload to external server if driver is 'external'
    if (
      props.storageConfig.driver === "external" &&
      props.storageConfig.externalUrl &&
      props.storageConfig.externalToken
    ) {
      formData.append("senderName", "Portal ALYA");
      formData.append("uploaderPhone", "081378949932");
      formData.append("docNumber", String(values.nomor));
      formData.append("docDate", values.tanggalPenetapan);
      formData.append("title", values.judul);
      formData.append("year", String(values.tahun));
      formData.append("sourceType", "api");
      formData.append("caption", values.judul);
      formData.append("description", values.judul);
      formData.append("category", "hukum-peraturan");

      const response = await fetch(props.storageConfig.externalUrl, {
        method: "POST",
        headers: {
          "x-integration-token": props.storageConfig.externalToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Direct upload failed with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.data?.archive?.archiveId) {
        throw new Error("Gagal mendapatkan archive ID dari server eksternal.");
      }

      return `/api/pkpu/file/${result.data.archive.archiveId}`;
    }

    // Default to ALYA API upload (which might hit Vercel limit)
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const rawPayload = await response.json().catch(() => null);
    const payload = rawPayload as { fileUrl?: string; message?: string } | null;

    if (!response.ok || !payload?.fileUrl) {
      throw new Error(payload?.message ?? "Upload PDF gagal.");
    }
    return payload.fileUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!values.kategori) return setError("Kategori wajib dipilih.");
    if (!values.judul || values.judul.trim().length < 5) return setError("Judul minimal 5 karakter.");
    if (!values.nomor || values.nomor < 1) return setError("Nomor tidak valid.");
    if (!values.tahun || values.tahun < 1945) return setError("Tahun tidak valid.");
    if (!values.tanggalPenetapan) return setError("Tanggal penetapan wajib diisi.");

    if ((values.statusHukum === "revisi" || values.statusHukum === "dicabut") && !values.parentId) {
      return setError(`PKPU ${values.statusHukum} wajib memilih PKPU induk sebagai parent.`);
    }

    if (values.statusHukum === "berlaku" && values.parentId) {
      return setError("PKPU berlaku (induk) tidak boleh memiliki parent.");
    }

    if (props.mode === "create" && !pdfFile) {
      return setError("File PDF wajib diunggah.");
    }

    setIsSubmitting(true);
    try {
      const fileUrl = await uploadIfNeeded();
      const payload = {
        nomor: values.nomor,
        tahun: values.tahun,
        judul: values.judul.trim(),
        tanggalPenetapan: values.tanggalPenetapan,
        statusHukum: values.statusHukum,
        kategori: values.kategori,
        fileUrl,
        parentId: values.statusHukum === "berlaku" ? null : values.parentId,
        isActive: values.isActive,
      };

      const endpoint =
        props.mode === "create" ? "/api/pkpu" : `/api/pkpu/${encodeURIComponent(props.pkpuId ?? "")}`;
      const method = props.mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(body?.message ?? "Permintaan gagal diproses.");
        return;
      }

      router.replace("/admin/pkpu");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Permintaan gagal diproses.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Nomor</span>
          <input
            type="number"
            min={1}
            value={values.nomor}
            onChange={(e) => update("nomor", Number(e.target.value))}
            className="w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Tahun</span>
          <input
            type="number"
            min={1945}
            max={2200}
            value={values.tahun}
            onChange={(e) => update("tahun", Number(e.target.value))}
            className="w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="font-semibold text-slate-700">Judul</span>
          <input
            type="text"
            value={values.judul}
            onChange={(e) => update("judul", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Tentang ..."
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Tanggal Penetapan</span>
          <input
            type="date"
            value={values.tanggalPenetapan}
            onChange={(e) => update("tanggalPenetapan", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Status Hukum</span>
          <select
            value={values.statusHukum}
            onChange={(e) => {
              const nextStatus = e.target.value as StatusHukum;
              update("statusHukum", nextStatus);
              if (nextStatus === "berlaku") update("parentId", null);
            }}
            className="w-full rounded border border-slate-300 px-3 py-2"
          >
            <option value="berlaku">Berlaku</option>
            <option value="revisi">Revisi</option>
            <option value="dicabut">Dicabut</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Kategori</span>
          <select
            value={values.kategori}
            onChange={(e) => update("kategori", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
          >
            {props.kategoriOptions.map((k) => (
              <option key={k._id} value={k._id}>
                {k.nama}
              </option>
            ))}
          </select>
        </label>

        {values.statusHukum === "revisi" || values.statusHukum === "dicabut" ? (
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700">
              {values.statusHukum === "revisi" ? "Revisi dari" : "Mencabut"} (PKPU Induk)
            </span>
            <select
              value={values.parentId ?? ""}
              onChange={(e) => update("parentId", e.target.value || null)}
              className="w-full rounded border border-slate-300 px-3 py-2"
              required
            >
              <option value="">Pilih PKPU Induk</option>
              {filteredIndukOptions.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nomor}/{p.tahun} — {p.judul}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="space-y-1 text-sm md:col-span-2">
          <span className="font-semibold text-slate-700">File PDF</span>
          {values.fileUrl ? (
            <p className="text-xs text-slate-600">
              File saat ini:{" "}
              <a href={values.fileUrl} className="font-semibold text-[#B91C1C] hover:underline">
                {values.fileUrl}
              </a>
            </p>
          ) : null}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-500">Unggah PDF untuk preview dan download.</p>
        </label>

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-semibold text-slate-700">Aktifkan publikasi</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
