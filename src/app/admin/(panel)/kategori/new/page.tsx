import { KategoriForm } from "@/components/admin/KategoriForm";
import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";

export default async function AdminKategoriCreatePage() {
  await connectDb();
  const parentOptions = await KategoriModel.find().sort({ nama: 1 }).select("_id nama").lean();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Tambah Kategori</h2>
        <p className="mt-1 text-sm text-slate-600">Buat kategori baru untuk pengelompokan regulasi.</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <KategoriForm
          mode="create"
          parentOptions={parentOptions.map((k) => ({ _id: k._id.toString(), nama: k.nama }))}
        />
      </section>
    </div>
  );
}
