import { PkpuForm } from "@/components/admin/PkpuForm";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export default async function AdminPkpuCreatePage() {
  await connectDb();
  const [kategoriDocs, indukOptions] = await Promise.all([
    KategoriModel.find().sort({ nama: 1 }).select("_id nama parentId").lean(),
    PkpuModel.find({ statusHukum: { $in: ["berlaku", "induk"] } })
      .sort({ tahun: -1, nomor: -1 })
      .select("_id nomor tahun judul")
      .lean(),
  ]);

  const kategoriById = new Map<string, (typeof kategoriDocs)[number]>();
  for (const k of kategoriDocs) kategoriById.set(k._id.toString(), k);

  const childrenByParent = new Map<string, (typeof kategoriDocs)[number][]>();
  const roots: (typeof kategoriDocs)[number][] = [];
  for (const k of kategoriDocs) {
    const parentKey = k.parentId ? k.parentId.toString() : "";
    if (!parentKey || !kategoriById.has(parentKey)) {
      roots.push(k);
      continue;
    }
    const arr = childrenByParent.get(parentKey) ?? [];
    arr.push(k);
    childrenByParent.set(parentKey, arr);
  }

  const ordered: Array<{ _id: string; nama: string }> = [];
  const pushOrdered = (items: (typeof kategoriDocs)[number][], depth: number) => {
    const sorted = [...items].sort((a, b) => a.nama.localeCompare(b.nama));
    for (const item of sorted) {
      const prefix = "\u00A0\u00A0\u00A0".repeat(depth);
      ordered.push({ _id: item._id.toString(), nama: `${prefix}${item.nama}` });
      const children = childrenByParent.get(item._id.toString());
      if (children && children.length > 0) pushOrdered(children, depth + 1);
    }
  };
  pushOrdered(roots, 0);

  const storageConfig = {
    driver: env.STORAGE_DRIVER,
    externalUrl: env.EXTERNAL_UPLOAD_URL,
    externalToken: env.EXTERNAL_UPLOAD_TOKEN,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Tambah PKPU</h2>
        <p className="mt-1 text-sm text-slate-600">Lengkapi data regulasi dan unggah file PDF.</p>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <PkpuForm
          mode="create"
          storageConfig={storageConfig}
          kategoriOptions={ordered}
          indukOptions={indukOptions.map((p) => ({
            _id: p._id.toString(),
            nomor: p.nomor,
            tahun: p.tahun,
            judul: p.judul,
          }))}
        />
      </section>
    </div>
  );
}

