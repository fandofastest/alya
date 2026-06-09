import Link from "next/link";

import { SimpleDocumentDeleteButton } from "@/components/admin/SimpleDocumentDeleteButton";
import { getI18n } from "@/lib/i18n-server";
import { connectDb } from "@/lib/db";
import { formatTanggal } from "@/lib/utils";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export const dynamic = "force-dynamic";

export default async function AdminBeritaAcaraPage() {
  const { locale, t } = await getI18n();
  await connectDb();
  const items = await SimpleDocumentModel.find({ type: "berita-acara" }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#B91C1C]">{t.documents["berita-acara"].plural}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.admin.beritaAcaraDesc}</p>
        </div>
        <Link
          href="/admin/berita-acara/new"
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
        >
          {t.admin.addBeritaAcara}
        </Link>
      </section>

      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-4">{t.common.number}</th>
                <th className="px-6 py-4">{t.common.title}</th>
                <th className="px-6 py-4">{t.common.visibility}</th>
                <th className="px-6 py-4">{t.pkpu.publication}</th>
                <th className="px-6 py-4">{t.common.updatedAt}</th>
                <th className="px-6 py-4 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">
                    {t.documents.noItems}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.nomor}/{item.tahun}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.judul}</td>
                    <td className="px-6 py-4">{item.visibility === "private" ? t.common.private : t.common.public}</td>
                    <td className="px-6 py-4">{item.isActive ? t.common.active : t.common.inactive}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {item.updatedAt ? formatTanggal(item.updatedAt, locale) : "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link
                        href={`/admin/berita-acara/${item._id.toString()}`}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        {t.common.edit}
                      </Link>
                      <SimpleDocumentDeleteButton
                        id={item._id.toString()}
                        locale={locale}
                        type="berita-acara"
                        nomor={item.nomor}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
