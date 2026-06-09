import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { getI18n } from "@/lib/i18n-server";

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              Komisi Pemilihan Umum
            </p>
            <h1 className="text-2xl font-bold text-[#B91C1C]">{t.appName}</h1>
          </div>
          <LanguageSwitcher locale={locale} label={t.nav.language} variant="dark" />
        </div>
        {children}
      </div>
    </div>
  );
}

