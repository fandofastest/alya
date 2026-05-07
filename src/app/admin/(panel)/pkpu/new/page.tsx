import { PkpuForm } from "@/components/admin/PkpuForm";
import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export default async function AdminPkpuCreatePage() {
  await connectDb();
  const [kategoriOptions, indukOptions] = await Promise.all([
    KategoriModel.find().sort({ nama: 1 }).select("_id nama").lean(),
    PkpuModel.find({ statusHukum: { $in: ["berlaku", "induk"] } }).sort({ tahun: -1, nomor: -1 }).select("_id nomor tahun judul").lean(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Tambah PKPU</h2>
        <p className="mt-1 text-sm text-slate-600">Lengkapi data regulasi dan unggah file PDF.</p>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <PkpuForm
          mode="create"
          kategoriOptions={kategoriOptions.map((k) => ({ _id: k._id.toString(), nama: k.nama }))}
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

