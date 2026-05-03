import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/pkpu", label: "Daftar PKPU" },
  { href: "/bantuan", label: "Bantuan" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            Komisi Pemilihan Umum
          </p>
          <h1 className="text-lg font-bold text-[#1E3A8A]">Portal Regulasi PKPU</h1>
        </div>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#1E3A8A]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
