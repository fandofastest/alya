import Link from "next/link";

import { getUserSession } from "@/lib/auth";
import { UserLogoutButton } from "@/components/public/UserLogoutButton";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/pkpu", label: "Direktori" },
  { href: "/bantuan", label: "Bantuan" },
];

export async function SiteHeader() {
  const session = await getUserSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <img src="/logo.png" alt="Logo KPU" className="h-10 w-auto" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-[#F59E0B]">
              KPU KOTA DUMAI
            </p>
            <h1 className="text-xl font-black tracking-tight text-[#B91C1C]">
              SIPADU <span className="text-[#F59E0B]">HUKUM</span>
            </h1>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#B91C1C]">
              {link.label}
            </Link>
          ))}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 md:block">{session.email}</span>
              <UserLogoutButton />
            </div>
          ) : (
            <Link href="/login" className="rounded bg-[#B91C1C] px-3 py-1.5 text-sm font-semibold text-white">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
