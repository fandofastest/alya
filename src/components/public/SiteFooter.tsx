import { Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#1E3A8A] flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1E3A8A]">
                ALYA <span className="text-[#F59E0B]">Portal</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Jaringan Dokumentasi dan Informasi Hukum (JDIH) Komisi Pemilihan Umum Kota Dumai.
              Menyediakan akses mudah ke berbagai regulasi dan produk hukum resmi.
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <p>
                  Jl. Tuanku Tambusai, Bagan Besar, Kec. Bukit Kapur, Kota Dumai, Riau 28826
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                <a href="mailto:tekhumkpudumai@gmail.com" className="hover:text-[#1E3A8A] hover:underline">
                  tekhumkpudumai@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links / Social / Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Informasi</h4>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                &copy; {new Date().getFullYear()} KPU Kota Dumai. Seluruh hak cipta dilindungi. 
                Data regulasi diperbarui secara berkala sesuai dengan ketetapan resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-100 bg-slate-50 py-4">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            JDIH Komisi Pemilihan Umum Kota Dumai
          </p>
        </div>
      </div>
    </footer>
  );
}
