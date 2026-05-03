export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            Komisi Pemilihan Umum
          </p>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Portal Regulasi PKPU</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

