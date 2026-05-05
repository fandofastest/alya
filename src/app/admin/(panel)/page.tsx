import Link from "next/link";

import { formatTanggalIndonesia } from "@/lib/utils";
import { getAdminDashboardStats } from "@/lib/repositories";

function StatCard(props: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{props.label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1E3A8A]">{props.value}</p>
    </div>
  );

  return props.href ? (
    <Link href={props.href} className="block hover:border-[#1E3A8A]">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E3A8A]">Dashboard</h2>
            <p className="text-sm text-slate-600">Ringkasan data regulasi dan aktivitas terakhir.</p>
          </div>
          <Link
            href="/admin/pkpu/new"
            className="inline-flex items-center justify-center rounded bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white"
          >
            Tambah PKPU
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <StatCard label="Total PKPU" value={stats.totalPkpu.toString()} href="/admin/pkpu" />
        <StatCard label="Berlaku" value={stats.totalBerlaku.toString()} href="/admin/pkpu?statusHukum=berlaku" />
        <StatCard label="Revisi" value={stats.totalRevisi.toString()} href="/admin/pkpu?statusHukum=revisi" />
        <StatCard label="Dicabut" value={stats.totalDicabut.toString()} href="/admin/pkpu?statusHukum=dicabut" />
        <StatCard label="Kategori" value={stats.totalKategori.toString()} />
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1E3A8A]">Status Sistem</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Terakhir Diperbarui</p>
            <p className="mt-2 font-semibold text-slate-800">
              {stats.lastUpdatedAt ? formatTanggalIndonesia(stats.lastUpdatedAt) : "Belum ada pembaruan"}
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pengelolaan</p>
            <p className="mt-2 text-slate-700">
              Gunakan menu PKPU untuk membuat, memperbarui, atau menonaktifkan publikasi regulasi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

