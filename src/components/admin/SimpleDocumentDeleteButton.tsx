"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { getDictionary, type DocumentType, type Locale } from "@/lib/i18n";

export function SimpleDocumentDeleteButton(props: {
  id: string;
  locale: Locale;
  type: Exclude<DocumentType, "pkpu">;
  nomor: string;
}) {
  const router = useRouter();
  const t = getDictionary(props.locale);
  const labels = t.documents[props.type];
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const prompt =
      props.locale === "en"
        ? `Are you sure you want to delete ${labels.singular} "${props.nomor}"?`
        : `Apakah Anda yakin ingin menghapus ${labels.singular} "${props.nomor}"?`;
    if (!confirm(prompt)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/simple-documents/${props.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) throw new Error(data?.message ?? (props.locale === "en" ? "Delete failed." : "Gagal menghapus dokumen."));
      toast.success(data?.message ?? (props.locale === "en" ? "Deleted successfully." : "Dokumen berhasil dihapus."));
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : props.locale === "en" ? "Delete failed." : "Gagal menghapus dokumen.";
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
      {isDeleting ? t.common.loading : t.common.delete}
    </button>
  );
}
