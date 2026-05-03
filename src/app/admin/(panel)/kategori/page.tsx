import Link from "next/link";

import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";
import { KategoriDeleteButton } from "@/components/admin/KategoriDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  await connectDb();
  const kategori = await KategoriModel.find().sort({ nama: 1 }).lean();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">Kelola Kategori</h2>
          <p className="mt-1 text-sm text-slate-600">Daftar kategori regulasi untuk pengelompokan PKPU.</p>
        </div>
        <Link
          href="/admin/kategori/new"
          className="rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Tambah Kategori
        </Link>
      </section>

      <section className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {kategori.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">
                    Belum ada kategori yang dibuat.
                  </td>
                </tr>
              ) : (
                kategori.map((item) => (
                  <tr key={item._id.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.slug}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {item.deskripsi || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link
                        href={`/admin/kategori/${item._id.toString()}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <KategoriDeleteButton id={item._id.toString()} nama={item.nama} />
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
