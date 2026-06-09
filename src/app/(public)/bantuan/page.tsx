import { getI18n } from "@/lib/i18n-server";

export default async function BantuanPage() {
  const { t } = await getI18n();

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-[#B91C1C]">{t.help.title}</h2>
      <div className="mt-4 space-y-4 text-sm text-slate-700">
        <p>
          {t.help.intro}
        </p>
        <div className="grid gap-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">{t.help.officialEmail}</p>
            <p className="mt-1">tekhumkpudumai@gmail.com</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">{t.help.officeAddress}</p>
            <p className="mt-1">Jl. Tuanku Tambusai, Bagan Besar, Kec. Bukit Kapur, Kota Dumai, Riau 28826</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">{t.help.serviceHours}</p>
            <p className="mt-1">{t.help.serviceHoursValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
