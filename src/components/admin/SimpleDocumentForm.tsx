"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getDictionary, type Locale, type DocumentType } from "@/lib/i18n";

type SimpleDocumentFormValues = {
  nomor: string;
  tahun: number;
  judul: string;
  tanggalDokumen: string;
  visibility: "public" | "private";
  isActive: boolean;
  fileUrl: string;
};

type SimpleDocumentFormInitial = Partial<Omit<SimpleDocumentFormValues, "tanggalDokumen">> & {
  tanggalDokumen?: Date | string;
};

function toDateInputValue(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function SimpleDocumentForm(props: {
  locale: Locale;
  type: Exclude<DocumentType, "pkpu">;
  mode: "create" | "edit";
  documentId?: string;
  initial?: SimpleDocumentFormInitial;
}) {
  const router = useRouter();
  const t = getDictionary(props.locale);
  const [values, setValues] = useState<SimpleDocumentFormValues>(() => ({
    nomor: props.initial?.nomor ?? "",
    tahun: props.initial?.tahun ?? new Date().getFullYear(),
    judul: props.initial?.judul ?? "",
    tanggalDokumen: props.initial?.tanggalDokumen
      ? toDateInputValue(props.initial.tanggalDokumen)
      : toDateInputValue(new Date()),
    visibility: props.initial?.visibility ?? "public",
    isActive: props.initial?.isActive ?? true,
    fileUrl: props.initial?.fileUrl ?? "",
  }));
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SimpleDocumentFormValues>(key: K, value: SimpleDocumentFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadIfNeeded() {
    if (!pdfFile) return values.fileUrl;
    const formData = new FormData();
    formData.set("file", pdfFile);
    formData.set("nomor", values.nomor);
    formData.set("tahun", String(values.tahun));
    formData.set("judul", values.judul);
    formData.set("tanggalPenetapan", values.tanggalDokumen);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const payload = (await response.json().catch(() => null)) as { fileUrl?: string; message?: string } | null;

    if (!response.ok || !payload?.fileUrl) {
      throw new Error(payload?.message ?? "Upload PDF gagal.");
    }
    return payload.fileUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!values.nomor.trim()) return setError(props.locale === "en" ? "Document number is required." : "Nomor dokumen wajib diisi.");
    if (!values.judul.trim() || values.judul.trim().length < 5) {
      return setError(props.locale === "en" ? "Title must be at least 5 characters." : "Judul minimal 5 karakter.");
    }
    if (props.mode === "create" && !pdfFile) {
      return setError(props.locale === "en" ? "PDF file is required." : "File PDF wajib diunggah.");
    }

    setIsSubmitting(true);
    try {
      const fileUrl = await uploadIfNeeded();
      const payload = {
        type: props.type,
        nomor: values.nomor.trim(),
        tahun: values.tahun,
        judul: values.judul.trim(),
        tanggalDokumen: values.tanggalDokumen,
        visibility: values.visibility,
        fileUrl,
        isActive: values.isActive,
      };

      const endpoint =
        props.mode === "create"
          ? "/api/simple-documents"
          : `/api/simple-documents/${encodeURIComponent(props.documentId ?? "")}`;
      const method = props.mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(body?.message ?? (props.locale === "en" ? "Request failed." : "Permintaan gagal diproses."));
        return;
      }

      router.replace(props.type === "sk" ? "/admin/sk" : "/admin/berita-acara");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : props.locale === "en" ? "Request failed." : "Permintaan gagal diproses.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.common.number}</span>
          <input
            type="text"
            value={values.nomor}
            onChange={(e) => update("nomor", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder={t.documents.numberPlaceholder}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.common.year}</span>
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
          <span className="font-semibold text-slate-700">{t.common.title}</span>
          <input
            type="text"
            value={values.judul}
            onChange={(e) => update("judul", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder={t.documents.titlePlaceholder}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.common.date}</span>
          <input
            type="date"
            value={values.tanggalDokumen}
            onChange={(e) => update("tanggalDokumen", e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">{t.common.visibility}</span>
          <select
            value={values.visibility}
            onChange={(e) => update("visibility", e.target.value as "public" | "private")}
            className="w-full rounded border border-slate-300 px-3 py-2"
          >
            <option value="public">{t.common.public}</option>
            <option value="private">{t.common.private}</option>
          </select>
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="font-semibold text-slate-700">PDF</span>
          {values.fileUrl ? (
            <p className="text-xs text-slate-600">
              File:{" "}
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
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-semibold text-slate-700">{t.documents.publishTitle}</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          {t.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? t.common.loading : t.common.save}
        </button>
      </div>
    </form>
  );
}
