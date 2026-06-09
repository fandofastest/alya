import { Download, Eye, FileText } from "lucide-react";
import Link from "next/link";

import { getDictionary, type Locale, type DocumentType } from "@/lib/i18n";
import type { SimpleDocumentRecord } from "@/lib/types";
import { formatTanggal } from "@/lib/utils";

export function SimpleDocumentDetail(props: {
  locale: Locale;
  type: Exclude<DocumentType, "pkpu">;
  item: SimpleDocumentRecord;
}) {
  const t = getDictionary(props.locale);
  const labels = t.documents[props.type];
  const basePath = props.type === "sk" ? "/sk" : "/berita-acara";
  const downloadUrl = `/api/simple-documents/${props.item._id}/download`;

  return (
    <div className="space-y-6">
      <Link href={basePath} className="inline-flex items-center text-sm font-semibold text-[#B91C1C] hover:underline">
        {t.documents.backToList}
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#15803d]">{labels.long}</p>
            <h1 className="text-2xl font-black text-slate-900">
              {labels.singular} {props.item.nomor} / {props.item.tahun}
            </h1>
            <p className="text-sm text-slate-700">{props.item.judul}</p>
            <p className="text-xs text-slate-500">{formatTanggal(props.item.tanggalDokumen, props.locale)}</p>
          </div>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B91C1C] px-4 py-2 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:bg-red-700"
          >
            <Download className="h-4 w-4" />
            {t.common.download}
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">{t.documents.detailTitle}</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{t.common.number}</dt>
                <dd className="font-semibold text-slate-900">{props.item.nomor}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.common.year}</dt>
                <dd className="font-semibold text-slate-900">{props.item.tahun}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t.common.date}</dt>
                <dd className="font-semibold text-slate-900">{formatTanggal(props.item.tanggalDokumen, props.locale)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">{t.documents.statistics}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Eye className="h-4 w-4" />
                  {t.documents.views}
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">{props.item.viewCount ?? 0}</div>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Download className="h-4 w-4" />
                  {t.documents.downloads}
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">{props.item.downloadCount ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-inner">
            <div className="mb-3 flex items-center gap-2 px-2 pt-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4" />
              {t.common.preview}
            </div>
            <iframe
              src={`${downloadUrl}#toolbar=0`}
              title={`${labels.singular} ${props.item.nomor}`}
              className="h-[800px] w-full rounded-lg border border-slate-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
