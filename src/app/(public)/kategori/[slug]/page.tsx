import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/public/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPkpuByKategoriSlug } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function KategoriPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { kategori, data } = await getPkpuByKategoriSlug(slug);
  if (!kategori) return notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#B91C1C]">{kategori.nama}</h2>
        <p className="mt-2 text-sm text-slate-600">{kategori.deskripsi || "Kategori regulasi PKPU."}</p>
      </section>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        {data.length === 0 ? (
          <EmptyState title="Belum ada PKPU dalam kategori ini." description="Silakan cek kembali pada waktu lain." />
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <article key={item._id.toString()} className="rounded border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#B91C1C]">
                      <Link href={`/pkpu/${item.slug}`} className="hover:underline">
                        PKPU No {item.nomor} Tahun {item.tahun}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-slate-700">{item.judul}</p>
                  </div>
                  <StatusBadge status={item.statusHukum} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
