export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            Komisi Pemilihan Umum
          </p>
          <h1 className="text-2xl font-bold text-[#B91C1C]">SIPADU HUKUM</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

