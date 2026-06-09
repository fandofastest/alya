import Link from "next/link";

import { connectDb } from "@/lib/db";
import { formatTanggalIndonesia } from "@/lib/utils";
import { UserModel } from "@/models/User";
import { UserDeleteButton } from "@/components/admin/UserDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDb();
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#B91C1C]">Kelola User</h2>
          <p className="mt-1 text-sm text-slate-600">Daftar user untuk akses dokumen private.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
        >
          Tambah User
        </Link>
      </section>

      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Dibuat</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
                    Belum ada user yang dibuat.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-slate-700">{u.nama}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {u.createdAt ? formatTanggalIndonesia(u.createdAt) : "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <Link
                        href={`/admin/users/${u._id.toString()}`}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <UserDeleteButton id={u._id.toString()} email={u.email} />
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
