import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-white py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 w-fit">
              Sistem Informasi Ekstrakurikuler Sekolah
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Kembangkan Potensi dan Prestasi Bersama <span className="text-orange-500">EkskulKu</span>
            </h1>
            
            <p className="text-lg text-slate-600 md:text-xl max-w-[600px]">
              Kelola kegiatan ekstrakurikuler secara modern, terstruktur, dan mudah diakses oleh siswa, pembina, serta orang tua.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/ekstrakurikuler"
                className={buttonVariants({ variant: "default", size: "lg", className: "bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto gap-2" })}
              >
                Jelajahi Ekstrakurikuler
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/kontak"
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto gap-2" })}
              >
                <Phone className="h-4 w-4" />
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Right Column: Placeholder Illustration */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <span className="text-2xl" aria-hidden="true">🖼️</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-500">Placeholder Illustration Area</h3>
              <p className="text-sm">Hero graphic goes here</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
