import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { getAdminSession } from "@/lib/auth";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pkpu", label: "PKPU" },
  { href: "/admin/kategori", label: "Kategori" },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo KPU" className="h-10 w-auto" />
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 leading-none">
                Panel Administrasi
              </p>
              <h1 className="text-lg font-black text-[#B91C1C] leading-none">SIPADU HUKUM</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-slate-600 md:block">{session.email}</p>
            <AdminLogoutButton />
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50">
          <nav className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[#B91C1C]">
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              className="ml-auto rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Lihat Situs Publik
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

