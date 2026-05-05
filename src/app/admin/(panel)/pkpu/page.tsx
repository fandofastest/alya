import Link from "next/link";

import { PkpuDeleteButton } from "@/components/admin/PkpuDeleteButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { connectDb } from "@/lib/db";
import { buildPkpuFilters } from "@/lib/pkpu-query";
import { formatTanggalIndonesia } from "@/lib/utils";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

type SearchParams = {
  q?: string;
  tahun?: string;
  statusHukum?: "berlaku" | "revisi" | "dicabut";
  kategori?: string;
  isActive?: "true" | "false";
  page?: string;
};

function buildSearchParamsObject(searchParams: SearchParams) {
  const sp = new URLSearchParams();
  if (searchParams.q) sp.set("q", searchParams.q);
  if (searchParams.tahun) sp.set("tahun", searchParams.tahun);
  if (searchParams.statusHukum) sp.set("statusHukum", searchParams.statusHukum);
  if (searchParams.kategori) sp.set("kategori", searchParams.kategori);
  if (searchParams.isActive) sp.set("isActive", searchParams.isActive);
  return sp;
}

export default async function AdminPkpuListPage(props: { searchParams: Promise<SearchParams> }) {
  await connectDb();
  const searchParams = await props.searchParams;

  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 20;
  const skip = (page - 1) * limit;

  const { filter, query } = buildPkpuFilters(buildSearchParamsObject(searchParams));

  const [data, total, kategoriList] = await Promise.all([
    PkpuModel.find(filter)
      .populate("kategori")
      .populate("parentId", "nomor tahun slug judul")
      .sort(query ? { score: { $meta: "textScore" } } : { updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PkpuModel.countDocuments(filter),
    KategoriModel.find().sort({ nama: 1 }).lean(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E3A8A]">Manajemen PKPU</h2>
            <p className="text-sm text-slate-600">Kelola data regulasi, hubungan status hukum, dan file PDF.</p>
          </div>
          <Link
            href="/admin/pkpu/new"
            className="inline-flex items-center justify-center rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white"
          >
            Tambah PKPU
          </Link>
        </div>

        <form className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-6">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Cari judul..."
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
          <input
            type="number"
            name="tahun"
            defaultValue={searchParams.tahun ?? ""}
            placeholder="Tahun"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            name="statusHukum"
            defaultValue={searchParams.statusHukum ?? ""}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="berlaku">Berlaku</option>
            <option value="revisi">Revisi</option>
            <option value="dicabut">Dicabut</option>
          </select>
          <select
            name="kategori"
            defaultValue={searchParams.kategori ?? ""}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((k) => (
              <option key={k._id.toString()} value={k._id.toString()}>
                {k.nama}
              </option>
            ))}
          </select>
          <select
            name="isActive"
            defaultValue={searchParams.isActive ?? ""}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Status Publikasi</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

          <div className="flex flex-wrap gap-3 md:col-span-6">
            <button type="submit" className="rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white">
              Terapkan Filter
            </button>
            <Link
              href="/admin/pkpu"
              className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Total: <span className="font-semibold text-slate-900">{total}</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/admin/pkpu?${new URLSearchParams({ ...searchParams, page: String(Math.max(1, page - 1)) } as Record<string, string>).toString()}`}
              className={`rounded border px-3 py-2 font-semibold ${
                page <= 1 ? "pointer-events-none border-slate-200 text-slate-400" : "border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              Sebelumnya
            </Link>
            <span className="text-slate-600">
              Halaman {page} / {totalPages}
            </span>
            <Link
              href={`/admin/pkpu?${new URLSearchParams({ ...searchParams, page: String(Math.min(totalPages, page + 1)) } as Record<string, string>).toString()}`}
              className={`rounded border px-3 py-2 font-semibold ${
                page >= totalPages
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              Berikutnya
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Nomor/Tahun</th>
                <th className="px-4 py-3">Tentang</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Relasi</th>
                <th className="px-4 py-3">Publikasi</th>
                <th className="px-4 py-3">Diperbarui</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => {
                const kategori = item.kategori as { nama?: string } | null;
                const parent = item.parentId as { nomor?: number; tahun?: number; judul?: string } | null;
                return (
                  <tr key={item._id.toString()} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.nomor}/{item.tahun}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{item.judul}</p>
                      <p className="text-xs text-slate-500">{item.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.statusHukum} />
                    </td>
                    <td className="px-4 py-3">{kategori?.nama ?? "-"}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {(item.statusHukum === "revisi" || item.statusHukum === "dicabut") && parent ? (
                        <span>
                          {item.statusHukum === "revisi" ? "Revisi dari" : "Mencabut"} {parent.nomor}/{parent.tahun}
                        </span>
                      ) : item.statusHukum === "berlaku" || item.statusHukum === "induk" ? (
                        <span>Induk</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {item.updatedAt ? formatTanggalIndonesia(item.updatedAt) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <Link
                          href={`/admin/pkpu/${item._id.toString()}/edit`}
                          className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                        >
                          Edit
                        </Link>
                        <a href={item.fileUrl} className="text-sm font-semibold text-slate-700 hover:underline" download>
                          Download
                        </a>
                        <PkpuDeleteButton id={item._id.toString()} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

