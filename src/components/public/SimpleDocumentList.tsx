import { Download, Eye, FileText, Search } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/public/EmptyState";
import { getDictionary, type Locale, type DocumentType } from "@/lib/i18n";
import type { SimpleDocumentRecord } from "@/lib/types";
import { formatTanggal } from "@/lib/utils";

export function SimpleDocumentList(props: {
  locale: Locale;
  type: Exclude<DocumentType, "pkpu">;
  items: SimpleDocumentRecord[];
  q?: string;
}) {
  const t = getDictionary(props.locale);
  const labels = t.documents[props.type];
  const basePath = props.type === "sk" ? "/sk" : "/berita-acara";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#B91C1C]">{labels.plural}</h2>
          <p className="mt-1 text-sm text-slate-600">{labels.desc}</p>
        </div>

        <form className="relative flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={props.q ?? ""}
              placeholder={t.documents.searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-[#B91C1C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#B91C1C] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:bg-red-700"
          >
            {t.common.search}
          </button>
        </form>
      </section>

      <div className="pb-2 text-xs font-medium text-slate-500">
        {t.common.total}: <span className="font-bold text-slate-900">{props.items.length}</span>
      </div>

      <div className="space-y-4">
        {props.items.length === 0 ? (
          <EmptyState title={t.documents.noItems} description={t.documents.noItemsDesc} />
        ) : (
          props.items.map((item) => (
            <article
              key={item._id}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
            >
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
                {labels.long}
              </div>
              <Link href={`${basePath}/${item.slug}`} className="block">
                <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-[#B91C1C]">
                  {labels.singular} {item.nomor} / {item.tahun}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600 italic">
                  &quot;{item.judul}&quot;
                </p>
              </Link>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{formatTanggal(item.tanggalDokumen, props.locale)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {item.viewCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    {item.downloadCount ?? 0}
                  </span>
                </div>
                <Link
                  href={`${basePath}/${item.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-[#B91C1C] hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t.common.detail}
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
