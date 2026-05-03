import Link from "next/link";
import { FileText, Search, BookOpen, Layers, Clock, ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/public/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatTanggalIndonesia } from "@/lib/utils";
import { getKategoriList, getLatestPkpu } from "@/lib/repositories";
import { PublicSearchForm } from "@/components/public/PublicSearchForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestPkpu, kategori] = await Promise.all([getLatestPkpu(6), getKategoriList()]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="hero-gradient -mt-8 -mx-4 px-4 py-20 text-center text-white shadow-inner md:py-28">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-blue-100 backdrop-blur-md">
              <BookOpen size={16} />
              <span>Jaringan Dokumentasi dan Informasi Hukum</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Portal Regulasi <span className="text-[#F59E0B]">ALYA</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100/90 md:text-xl">
              Temukan dan unduh produk hukum resmi Peraturan Komisi Pemilihan Umum dengan mudah, cepat, dan akurat.
            </p>
          </div>

          <PublicSearchForm />
        </div>
      </section>

      {/* Statistik / Keunggulan */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{latestPkpu.length}+</p>
            <p className="text-sm font-medium text-slate-500">Regulasi Terdaftar</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">24/7</p>
            <p className="text-sm font-medium text-slate-500">Akses Informasi Publik</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{kategori.length}</p>
            <p className="text-sm font-medium text-slate-500">Kategori Dokumen</p>
          </div>
        </div>
      </div>

      {/* Kategori Section */}
      <section className="space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Eksplorasi Berdasarkan Kategori</h2>
          <p className="mt-2 text-slate-600">Pilih kategori regulasi untuk memfilter pencarian Anda.</p>
        </div>
        
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kategori.map((item) => (
            <Link
              key={item._id.toString()}
              href={`/kategori/${item.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-blue-500"
            >
              <div className="relative z-10 space-y-3">
                <div className="inline-block rounded-lg bg-slate-50 p-2 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                  <Layers size={20} />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700">{item.nama}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{item.deskripsi || "Dokumen regulasi terkait kategori ini."}</p>
              </div>
              <div className="absolute bottom-4 right-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-400">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PKPU Terbaru Section */}
      <section className="space-y-6 px-4">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Produk Hukum Terbaru</h2>
            <p className="mt-1 text-sm text-slate-600">Daftar regulasi PKPU yang baru saja diterbitkan.</p>
          </div>
          <Link href="/pkpu" className="flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {latestPkpu.length === 0 ? (
          <EmptyState title="Belum ada PKPU" description="Data regulasi akan ditampilkan pada bagian ini." />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {latestPkpu.map((item) => (
              <Link
                key={item._id.toString()}
                href={`/pkpu/${item.slug}`}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-blue-200 md:flex-row md:items-center"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                  <FileText size={28} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      PKPU No. {item.nomor} Tahun {item.tahun}
                    </span>
                    <StatusBadge status={item.statusHukum} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-800 line-clamp-1">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ditetapkan pada: <span className="font-medium">{formatTanggalIndonesia(item.tanggalPenetapan)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition-colors group-hover:bg-[#1E3A8A] group-hover:text-white">
                  Lihat Detail
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
