import Link from "next/link";

import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";
import { KategoriDeleteButton } from "@/components/admin/KategoriDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  await connectDb();
  const kategori = await KategoriModel.find().sort({ nama: 1 }).lean();

  const byId = new Map<string, (typeof kategori)[number]>();
  for (const k of kategori) byId.set(k._id.toString(), k);

  const childrenByParent = new Map<string, (typeof kategori)[number][]>();
  const roots: (typeof kategori)[number][] = [];
  for (const k of kategori) {
    const parentKey = k.parentId ? k.parentId.toString() : "";
    if (!parentKey) {
      roots.push(k);
      continue;
    }
    const arr = childrenByParent.get(parentKey) ?? [];
    arr.push(k);
    childrenByParent.set(parentKey, arr);
  }

  const rows: Array<{ item: (typeof kategori)[number]; depth: number; parentName: string | null }> = [];
  const pushRows = (items: (typeof kategori)[number][], depth: number) => {
    const sorted = [...items].sort((a, b) => a.nama.localeCompare(b.nama));
    for (const item of sorted) {
      const parentName = item.parentId ? byId.get(item.parentId.toString())?.nama ?? null : null;
      rows.push({ item, depth, parentName });
      const children = childrenByParent.get(item._id.toString());
      if (children && children.length > 0) pushRows(children, depth + 1);
    }
  };
  pushRows(roots, 0);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#B91C1C]">Kelola Kategori</h2>
          <p className="mt-1 text-sm text-slate-600">Daftar kategori regulasi untuk pengelompokan PKPU.</p>
        </div>
        <Link
          href="/admin/kategori/new"
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
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
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                    Belum ada kategori yang dibuat.
                  </td>
                </tr>
              ) : (
                rows.map(({ item, depth, parentName }) => (
                  <tr key={item._id.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <span className={depth > 0 ? "pl-6" : ""}>{item.nama}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{parentName ?? "-"}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.slug}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {item.deskripsi || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link
                        href={`/admin/kategori/${item._id.toString()}`}
                        className="text-xs font-semibold text-red-600 hover:underline"
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
