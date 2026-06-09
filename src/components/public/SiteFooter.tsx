import { Mail, MapPin } from "lucide-react";

import { getI18n } from "@/lib/i18n-server";

export async function SiteFooter() {
  const { t } = await getI18n();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#B91C1C] flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-[#B91C1C]">
                {t.appName.split(" ")[0]} <span className="text-[#F59E0B]">{t.appName.split(" ")[1]}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              {t.footer.about}
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{t.footer.contactUs}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <p>
                  Jl. Tuanku Tambusai, Bagan Besar, Kec. Bukit Kapur, Kota Dumai, Riau 28826
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                <a href="mailto:tekhumkpudumai@gmail.com" className="hover:text-[#B91C1C] hover:underline">
                  tekhumkpudumai@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links / Social / Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{t.footer.information}</h4>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                &copy; {new Date().getFullYear()} {t.footer.copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-100 bg-slate-50 py-4">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
