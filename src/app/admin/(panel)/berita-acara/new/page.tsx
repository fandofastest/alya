import { SimpleDocumentForm } from "@/components/admin/SimpleDocumentForm";
import { getI18n } from "@/lib/i18n-server";

export default async function AdminBeritaAcaraCreatePage() {
  const { locale, t } = await getI18n();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">{t.admin.addBeritaAcara}</h2>
        <p className="mt-1 text-sm text-slate-600">{t.admin.beritaAcaraDesc}</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <SimpleDocumentForm locale={locale} type="berita-acara" mode="create" />
      </section>
    </div>
  );
}
