import { notFound } from "next/navigation";

import { KategoriForm } from "@/components/admin/KategoriForm";
import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";

export default async function AdminKategoriEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await connectDb();
  const kategori = await KategoriModel.findById(id).lean();

  if (!kategori) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Edit Kategori</h2>
        <p className="mt-1 text-sm text-slate-600">Perbarui informasi kategori: {kategori.nama}</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <KategoriForm
          mode="edit"
          id={id}
          initial={{
            nama: kategori.nama,
            deskripsi: kategori.deskripsi || "",
          }}
        />
      </section>
    </div>
  );
}
