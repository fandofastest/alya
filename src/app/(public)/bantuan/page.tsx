export default function BantuanPage() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-[#B91C1C]">Bantuan Layanan</h2>
      <div className="mt-4 space-y-4 text-sm text-slate-700">
        <p>
          Selamat datang di layanan bantuan <strong>SIPADU HUKUM</strong> KPU Kota Dumai. Jika Anda memiliki pertanyaan terkait regulasi atau penggunaan portal ini, silakan hubungi kami:
        </p>
        <div className="grid gap-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">Email Resmi</p>
            <p className="mt-1">tekhumkpudumai@gmail.com</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">Alamat Kantor</p>
            <p className="mt-1">Jl. Tuanku Tambusai, Bagan Besar, Kec. Bukit Kapur, Kota Dumai, Riau 28826</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900 underline underline-offset-4 decoration-[#B91C1C]">Waktu Layanan</p>
            <p className="mt-1">Senin - Jumat: 08.00 - 16.00 WIB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
