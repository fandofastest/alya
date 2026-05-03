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
  statusHukum?: "induk" | "revisi";
  kategori?: string;
};

export default async function PkpuListPage(props: { searchParams: Promise<SearchParams> }) {
  await connectDb();
  const searchParams = await props.searchParams;

  const filter: Record<string, unknown> = { isActive: true };
  if (searchParams.q) filter.$text = { $search: searchParams.q };
  if (searchParams.tahun && !Number.isNaN(Number(searchParams.tahun))) {
    filter.tahun = Number(searchParams.tahun);
  }
  if (searchParams.statusHukum === "induk" || searchParams.statusHukum === "revisi") {
    filter.statusHukum = searchParams.statusHukum;
  }
  if (searchParams.kategori) {
    filter.kategori = searchParams.kategori;
  }

  const [pkpuList, kategoriList] = await Promise.all([
    PkpuModel.find(filter).populate("kategori").sort({ tahun: -1, nomor: -1 }).lean(),
    KategoriModel.find().sort({ nama: 1 }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1E3A8A]">Daftar PKPU</h2>
        <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Cari judul..."
            className="rounded border border-slate-300 px-3 py-2 text-sm"
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
            <option value="induk">Induk</option>
            <option value="revisi">Revisi</option>
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
          <button
            type="submit"
            className="rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white md:col-span-4 md:w-40"
          >
            Terapkan Filter
          </button>
        </form>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        {pkpuList.length === 0 ? (
          <EmptyState title="Data tidak ditemukan" description="Coba ubah kata kunci atau filter pencarian Anda." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3">Nomor</th>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">Tentang</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pkpuList.map((item) => (
                  <tr key={item._id.toString()}>
                    <td className="px-4 py-3">{item.nomor}</td>
                    <td className="px-4 py-3">{item.tahun}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{item.judul}</p>
                      <p className="text-xs text-slate-500">{formatTanggalIndonesia(item.tanggalPenetapan)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.statusHukum} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/pkpu/${item.slug}`} className="text-[#1E3A8A] hover:underline">
                          Preview
                        </Link>
                        <a href={item.fileUrl} className="text-[#1E3A8A] hover:underline" download>
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
