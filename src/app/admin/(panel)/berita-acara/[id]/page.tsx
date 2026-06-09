import { notFound } from "next/navigation";

import { SimpleDocumentForm } from "@/components/admin/SimpleDocumentForm";
import { getI18n } from "@/lib/i18n-server";
import { connectDb } from "@/lib/db";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export default async function AdminBeritaAcaraEditPage(props: { params: Promise<{ id: string }> }) {
  const { locale, t } = await getI18n();
  const { id } = await props.params;

  await connectDb();
  const item = await SimpleDocumentModel.findById(id).lean();
  if (!item || item.type !== "berita-acara") return notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">{t.common.edit} {t.documents["berita-acara"].singular}</h2>
        <p className="mt-1 text-sm text-slate-600">{item.nomor}</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <SimpleDocumentForm
          locale={locale}
          type="berita-acara"
          mode="edit"
          documentId={id}
          initial={{
            nomor: item.nomor,
            tahun: item.tahun,
            judul: item.judul,
            tanggalDokumen: item.tanggalDokumen,
            visibility: item.visibility,
            fileUrl: item.fileUrl,
            isActive: item.isActive,
          }}
        />
      </section>
    </div>
  );
}
