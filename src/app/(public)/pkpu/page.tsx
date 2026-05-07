import clsx from "clsx";
import {
  Award,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  Filter,
  FolderOpen,
  Search,
} from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/public/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { connectDb } from "@/lib/db";
import { formatTanggalIndonesia } from "@/lib/utils";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  tahun?: string;
  statusHukum?: string;
  kategori?: string;
  sort?: string;
};

export default async function PkpuListPage(props: { searchParams: Promise<SearchParams> }) {
  await connectDb();
  const searchParams = await props.searchParams;

  const filter: Record<string, unknown> = { isActive: true };
  if (searchParams.q) filter.$text = { $search: searchParams.q };
  if (searchParams.tahun) filter.tahun = Number(searchParams.tahun);
  if (searchParams.statusHukum) filter.statusHukum = searchParams.statusHukum;
  if (searchParams.kategori) filter.kategori = searchParams.kategori;

  const sortOption: Record<string, 1 | -1> = {};
  if (searchParams.sort === "popular") {
    sortOption.viewCount = -1;
  } else {
    sortOption.tahun = -1;
    sortOption.nomor = -1;
  }

  // Fetch Sidebar Data (Counts)
  const [pkpuList, kategoriList, yearStats] = await Promise.all([
    PkpuModel.find(filter).populate("kategori").sort(sortOption).limit(50).lean(),
    KategoriModel.aggregate([
      {
        $lookup: {
          from: "pkpus",
          localField: "_id",
          foreignField: "kategori",
          as: "files",
        },
      },
      {
        $project: {
          nama: 1,
          slug: 1,
          count: { $size: "$files" },
        },
      },
      { $sort: { nama: 1 } },
    ]),
    PkpuModel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$tahun", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]),
  ]);

  const currentStatus = searchParams.statusHukum || "";
  const currentSort = searchParams.sort || "";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Sidebar */}
      <aside className="space-y-6 lg:col-span-3">
        {/* Card: Direktori */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-[#15803d] bg-slate-50 px-4 py-3">
            <FolderOpen className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700">Direktori</h3>
          </div>
          <div className="p-2">
            <Link
              href="/pkpu"
              className={clsx(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                !searchParams.kategori ? "bg-red-50 font-bold text-[#B91C1C]" : "text-slate-600"
              )}
            >
              <span>Semua Direktori</span>
            </Link>
            {kategoriList.map((kat) => (
              <Link
                key={kat._id.toString()}
                href={`/pkpu?kategori=${kat._id.toString()}`}
                className={clsx(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                  searchParams.kategori === kat._id.toString()
                    ? "bg-red-50 font-bold text-[#B91C1C]"
                    : "text-slate-600"
                )}
              >
                <span>{kat.nama}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                  {kat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Card: Tahun */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b-2 border-[#15803d] bg-slate-50 px-4 py-3">
            <Calendar className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700">Tahun</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {yearStats.map((stat) => (
                <Link
                  key={stat._id}
                  href={`/pkpu?tahun=${stat._id}`}
                  className={clsx(
                    "flex items-center justify-between rounded border px-2 py-1.5 text-xs transition-all",
                    searchParams.tahun === String(stat._id)
                      ? "border-[#B91C1C] bg-red-50 font-bold text-[#B91C1C]"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <span>{stat._id}</span>
                  <span className="text-[10px] opacity-60">{stat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-9">
        {/* Search & Filter Header */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="relative flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q ?? ""}
                placeholder="Cari kata kunci peraturan..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-[#B91C1C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#B91C1C] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:bg-red-700 active:scale-95"
            >
              Cari Peraturan
            </button>
          </form>
        </section>

        {/* Tabs & Sort */}
        <div className="flex flex-col gap-4 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto pb-px">
            <Link
              href="/pkpu"
              className={clsx(
                "border-b-2 px-5 py-3 text-sm font-bold transition-all whitespace-nowrap",
                !currentStatus && currentSort !== "popular"
                  ? "border-[#B91C1C] text-[#B91C1C]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              Terbaru
            </Link>
            <Link
              href="/pkpu?statusHukum=berlaku"
              className={clsx(
                "border-b-2 px-5 py-3 text-sm font-bold transition-all whitespace-nowrap",
                currentStatus === "berlaku"
                  ? "border-[#B91C1C] text-[#B91C1C]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              Berlaku
            </Link>
            <Link
              href="/pkpu?sort=popular"
              className={clsx(
                "border-b-2 px-5 py-3 text-sm font-bold transition-all whitespace-nowrap",
                currentSort === "popular"
                  ? "border-[#B91C1C] text-[#B91C1C]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              Terpopuler
            </Link>
          </div>
          <div className="pb-2 text-xs font-medium text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{pkpuList.length}</span> peraturan
          </div>
        </div>

        {/* List Results */}
        <div className="space-y-4">
          {pkpuList.length === 0 ? (
            <EmptyState
              title="Peraturan tidak ditemukan"
              description="Sesuaikan filter atau kata kunci pencarian Anda."
            />
          ) : (
            pkpuList.map((item) => (
              <div
                key={item._id.toString()}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
              >
                {/* Item Breadcrumb */}
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
                  <span>Direktori</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>
                    {typeof item.kategori === "object" ? (item.kategori as any).nama : "Umum"}
                  </span>
                </div>

                {/* Status Timeline Header */}
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Upload: {formatTanggalIndonesia(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Penetapan: {formatTanggalIndonesia(item.tanggalPenetapan)}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={`/pkpu/${item.slug}`} className="mb-4 block">
                  <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-[#B91C1C]">
                    PKPU Nomor {item.nomor} Tahun {item.tahun}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600 italic">
                    "{item.judul}"
                  </p>
                </Link>

                {/* Bottom Stats & Actions */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-4">
                    <StatusBadge status={item.statusHukum} />
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{(item as any).viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>{(item as any).downloadCount || 0}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/api/pkpu/${item._id.toString()}/download`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-red-50 hover:text-[#B91C1C]"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

