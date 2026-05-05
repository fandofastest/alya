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
        <Link href="/" className="group">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-[#F59E0B]">
            KPU KOTA DUMAI
          </p>
          <h1 className="text-xl font-black tracking-tight text-[#1E3A8A]">
            ALYA <span className="text-[#F59E0B]">Portal</span>
          </h1>
        </Link>
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
