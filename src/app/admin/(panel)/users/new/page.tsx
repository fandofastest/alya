import { UserForm } from "@/components/admin/UserForm";

export default function AdminUserCreatePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Tambah User</h2>
        <p className="mt-1 text-sm text-slate-600">Buat user untuk akses dokumen private.</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <UserForm mode="create" />
      </section>
    </div>
  );
}
