import clsx from "clsx";
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Download,
  Eye,
  FileText,
  History,
  Info,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPkpuBySlug, getRevisiListByParent } from "@/lib/repositories";
import { formatTanggalIndonesia } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PkpuDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const pkpu = await getPkpuBySlug(slug);
  if (!pkpu) return notFound();

  const revisiList =
    pkpu.statusHukum === "berlaku" || pkpu.statusHukum === "induk"
      ? await getRevisiListByParent(pkpu._id.toString())
      : [];

  const kategoriNama =
    pkpu.kategori && typeof pkpu.kategori === "object" && "nama" in pkpu.kategori
      ? (pkpu.kategori as { nama?: string }).nama ?? "-"
      : "-";

  const kategoriSlug =
    pkpu.kategori && typeof pkpu.kategori === "object" && "slug" in pkpu.kategori
      ? (pkpu.kategori as { slug?: string }).slug ?? ""
      : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex text-xs text-slate-500 sm:text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-[#B91C1C]">
              Beranda
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4" />
              <Link href="/kategori" className="ml-1 hover:text-[#B91C1C] md:ml-2">
                Peraturan & Perundang-undangan
              </Link>
            </div>
          </li>
          {kategoriSlug && (
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/kategori/${kategoriSlug}`}
                  className="ml-1 line-clamp-1 hover:text-[#B91C1C] md:ml-2"
                >
                  {kategoriNama}
                </Link>
              </div>
            </li>
          )}
        </ol>
      </nav>

      {/* Main Title Section */}
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-3xl">
          PERATURAN & PERUNDANG-UNDANGAN
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-8">
          <div className="space-y-8">
            {/* Metadata Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Detail Peraturan</h2>
                  <StatusBadge status={pkpu.statusHukum} />
                </div>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-12 sm:gap-x-8">
                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">Jenis</dt>
                  <dd className="text-sm text-slate-900 sm:col-span-9">{kategoriNama}</dd>

                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">Nomor</dt>
                  <dd className="text-sm text-slate-900 sm:col-span-9">{pkpu.nomor}</dd>

                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">Tahun</dt>
                  <dd className="text-sm text-slate-900 sm:col-span-9">{pkpu.tahun}</dd>

                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">Tentang</dt>
                  <dd className="text-sm font-semibold leading-relaxed text-slate-900 sm:col-span-9">
                    {pkpu.judul}
                  </dd>

                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">Klasifikasi</dt>
                  <dd className="text-sm text-[#B91C1C] sm:col-span-9">{kategoriNama}</dd>

                  <dt className="text-sm font-medium text-slate-500 sm:col-span-3">
                    Materi Muatan Pokok
                  </dt>
                  <dd className="text-sm leading-relaxed text-slate-600 sm:col-span-9 italic">
                    Tersedia dalam salinan dokumen (silakan unduh Lampiran untuk detail lengkap).
                  </dd>
                </dl>
              </div>
            </div>

            {/* History Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-[#B91C1C]" />
                <h3 className="text-lg font-bold text-slate-800">Sejarah Lengkap</h3>
              </div>

              <div className="relative flex flex-col items-center py-8">
                {/* Timeline Line */}
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-slate-200" />

                <div className="relative flex w-full justify-around">
                  {/* If there's a parent, show it as an earlier point */}
                  {pkpu.parentId && typeof pkpu.parentId === "object" && (
                    <div className="group relative flex flex-col items-center">
                      <div className="mb-4 text-sm font-bold text-slate-500">
                        {(pkpu.parentId as { tahun: number }).tahun}
                      </div>
                      <div className="z-10 h-6 w-6 rounded-full border-4 border-white bg-slate-400 ring-2 ring-slate-400 group-hover:bg-slate-500" />
                      <div className="absolute -bottom-10 w-32 text-center text-xs text-slate-500 line-clamp-2">
                        PKPU No {(pkpu.parentId as { nomor: number }).nomor} (Induk/Revisi)
                      </div>
                    </div>
                  )}

                  {/* Current Document */}
                  <div className="relative flex flex-col items-center">
                    <div className="mb-4 text-sm font-bold text-[#B91C1C]">{pkpu.tahun}</div>
                    <div className="z-10 h-10 w-32 rounded-lg bg-[#B91C1C] px-3 py-1 text-center text-sm font-bold text-white shadow-lg shadow-red-200 ring-4 ring-white">
                      {pkpu.tahun}
                    </div>
                    <div className="absolute -bottom-8 w-40 text-center text-xs font-semibold text-slate-900">
                      Sesuai Dokumen Ini
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-slate-500"> Visualisasi timeline sejarah peraturan terkait. </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card: Lampiran */}
          <div className="overflow-hidden rounded-xl border-t-4 border-[#15803d] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Lampiran</h3>
            </div>
            <div className="p-5">
              <a
                href={pkpu.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 text-[#B91C1C] hover:text-red-700"
              >
                <div className="mt-1 rounded bg-red-50 p-2 text-[#B91C1C] group-hover:bg-red-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold underline decoration-red-200 underline-offset-4 group-hover:decoration-red-400">
                    {pkpu.judul.length > 40 ? pkpu.judul.substring(0, 40) + "..." : pkpu.judul}.pdf
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Download className="h-3 w-3" />
                    <span>Download File</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Card: Statistik */}
          <div className="overflow-hidden rounded-xl border-t-4 border-[#15803d] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700"> Statistik </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Eye className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500">Dilihat</div>
                    <div className="text-sm font-bold text-slate-800">1.240</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Download className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-500">Unduh</div>
                    <div className="text-sm font-bold text-slate-800">582</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Peraturan Pelaksana Dari / Terkait */}
          <div className="overflow-hidden rounded-xl border-t-4 border-[#15803d] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                {pkpu.statusHukum === "revisi" || pkpu.statusHukum === "dicabut"
                  ? "Mengacu Pada"
                  : "Peraturan Pelaksana Dari"}
              </h3>
            </div>
            <div className="p-5">
              {pkpu.parentId && typeof pkpu.parentId === "object" ? (
                <Link
                  href={`/pkpu/${(pkpu.parentId as { slug: string }).slug}`}
                  className="group flex items-start gap-3 text-[#B91C1C] hover:text-red-700"
                >
                  <div className="mt-1 rounded bg-red-50 p-2 text-[#B91C1C] group-hover:bg-red-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold underline decoration-red-200 underline-offset-4 group-hover:decoration-red-400">
                    PKPU No {(pkpu.parentId as { nomor: number }).nomor} Tahun{" "}
                    {(pkpu.parentId as { tahun: number }).tahun}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                  <Info className="h-4 w-4" />
                  <span>Tidak ada relasi peraturan induk.</span>
                </div>
              )}
            </div>
          </div>

          {/* Revisions List (if any) */}
          {(pkpu.statusHukum === "berlaku" || pkpu.statusHukum === "induk") &&
            revisiList.length > 0 && (
              <div className="overflow-hidden rounded-xl border-t-4 border-[#B91C1C] bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-red-50/50 px-5 py-3">
                  <ChevronRight className="h-4 w-4 text-red-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#B91C1C]">
                    Direvisi/Dicabut Oleh
                  </h3>
                </div>
                <div className="space-y-3 p-5">
                  {revisiList.map((item) => (
                    <Link
                      key={item._id.toString()}
                      href={`/pkpu/${item.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 p-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#B91C1C]"
                    >
                      <BarChart3 className="h-4 w-4 text-slate-400" />
                      <span>
                        PKPU No {item.nomor} Tahun {item.tahun}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* PDF Preview Section */}
      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Pratinjau Dokumen</h2>
          <a
            href={pkpu.fileUrl}
            download
            className="flex items-center gap-2 rounded-lg bg-[#B91C1C] px-4 py-2 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:bg-red-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-inner">
          <iframe
            src={`${pkpu.fileUrl}#toolbar=0`}
            title={`Preview ${pkpu.judul}`}
            className="h-[800px] w-full rounded-lg border border-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

