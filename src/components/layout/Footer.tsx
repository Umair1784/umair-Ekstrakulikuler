import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">EkskulKu</h2>
          <p className="text-slate-300 max-w-sm">
            Sistem Informasi Ekstrakurikuler yang memudahkan pendaftaran, absensi, dan pengelolaan kegiatan ekstrakurikuler di sekolah.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Tautan</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-slate-400 hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link href="/tentang" className="text-slate-400 hover:text-orange-500 transition-colors">Tentang</Link></li>
            <li><Link href="/ekstrakurikuler" className="text-slate-400 hover:text-orange-500 transition-colors">Ekstrakurikuler</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Informasi</h3>
          <ul className="space-y-2">
            <li><Link href="/prestasi" className="text-slate-400 hover:text-orange-500 transition-colors">Prestasi</Link></li>
            <li><Link href="/pengumuman" className="text-slate-400 hover:text-orange-500 transition-colors">Pengumuman</Link></li>
            <li><Link href="/kontak" className="text-slate-400 hover:text-orange-500 transition-colors">Kontak</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} EkskulKu. All rights reserved.</p>
      </div>
    </footer>
  );
}
