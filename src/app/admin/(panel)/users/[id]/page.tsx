import { notFound } from "next/navigation";

import { UserForm } from "@/components/admin/UserForm";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

export default async function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectDb();
  const user = await UserModel.findById(id).lean();
  if (!user) return notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#B91C1C]">Edit User</h2>
        <p className="mt-1 text-sm text-slate-600">Perbarui informasi user: {user.nip}</p>
      </section>

      <section className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <UserForm
          mode="edit"
          id={id}
          initial={{
            nip: user.nip,
            nama: user.nama,
            isActive: user.isActive ?? true,
            tipe: (user as any).tipe,
          }}
        />
      </section>
    </div>
  );
}
