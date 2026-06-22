import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
      <div className="max-w-md w-full">
        <h1 className="mb-4 text-6xl font-bold text-orange-600">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mb-8 text-slate-600">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link href="/" className={buttonVariants({ className: "bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto" })}>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
