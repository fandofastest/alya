import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatTanggalIndonesia } from "@/lib/utils";
import { getPkpuBySlug, getRevisiListByParent } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function PkpuDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const pkpu = await getPkpuBySlug(slug);
  if (!pkpu) return notFound();

  const revisiList =
    pkpu.statusHukum === "berlaku" || pkpu.statusHukum === "induk" ? await getRevisiListByParent(pkpu._id.toString()) : [];

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">
              PKPU Nomor {pkpu.nomor} Tahun {pkpu.tahun}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#B91C1C]">{pkpu.judul}</h2>
          </div>
          <StatusBadge status={pkpu.statusHukum} />
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Tanggal Penetapan:</span>{" "}
            {formatTanggalIndonesia(pkpu.tanggalPenetapan)}
          </p>
          <p>
            <span className="font-semibold">Kategori:</span>{" "}
            {pkpu.kategori && typeof pkpu.kategori === "object" && "nama" in pkpu.kategori
              ? (pkpu.kategori as { nama?: string }).nama ?? "-"
              : "-"}
          </p>
        </div>
        {(pkpu.statusHukum === "revisi" || pkpu.statusHukum === "dicabut") &&
        pkpu.parentId &&
        typeof pkpu.parentId === "object" &&
        "nomor" in pkpu.parentId &&
        "tahun" in pkpu.parentId ? (
          <p
            className={clsx(
              "mt-4 rounded px-3 py-2 text-sm",
              pkpu.statusHukum === "revisi" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-900"
            )}
          >
            {pkpu.statusHukum === "revisi" ? "Revisi dari" : "Mencabut"} PKPU No{" "}
            {(pkpu.parentId as { nomor: number }).nomor} Tahun {(pkpu.parentId as { tahun: number }).tahun}
          </p>
        ) : null}
        {(pkpu.statusHukum === "berlaku" || pkpu.statusHukum === "induk") && revisiList.length > 0 ? (
          <div className="mt-4 rounded bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-[#B91C1C]">Daftar Revisi/Pencabutan:</p>
            <ul className="mt-2 space-y-1 text-sm">
              {revisiList.map((item) => (
                <li key={item._id.toString()}>
                  <Link href={`/pkpu/${item.slug}`} className="text-[#B91C1C] hover:underline">
                    PKPU No {item.nomor} Tahun {item.tahun}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4">
          <a href={pkpu.fileUrl} download className="rounded bg-[#F59E0B] px-4 py-2 text-sm font-semibold">
            Download PDF
          </a>
        </div>
      </section>

      <section className="rounded-lg bg-white p-2 shadow-sm">
        <iframe
          src={pkpu.fileUrl}
          title={`Preview ${pkpu.judul}`}
          className="h-[70vh] w-full rounded border border-slate-200"
        />
      </section>
    </div>
  );
}
