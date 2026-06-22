import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 mb-6 px-3 py-1 text-sm font-medium">
            Kontak
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl mb-4">
            Hubungi Kami
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Kami siap membantu dan menerima pertanyaan terkait kegiatan ekstrakurikuler sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Alamat */}
          <Card className="rounded-xl shadow-sm border-slate-200 bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Alamat</h3>
              <p className="text-slate-600 font-medium">SMA Negeri Contoh</p>
              <p className="text-slate-500">Jl. Pendidikan No. 123</p>
            </CardContent>
          </Card>

          {/* Telepon */}
          <Card className="rounded-xl shadow-sm border-slate-200 bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Telepon</h3>
              <p className="text-slate-600 font-medium mt-1">(022) 1234567</p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="rounded-xl shadow-sm border-slate-200 bg-white">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Email</h3>
              <a href="mailto:info@ekskulku.com" className="text-orange-600 font-medium hover:underline mt-1">
                info@ekskulku.com
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-6 py-4 rounded-xl sm:rounded-full shadow-sm border border-slate-200 text-center sm:text-left">
            <Clock className="w-6 h-6 text-orange-600" />
            <div>
              <span className="font-semibold text-slate-900 sm:mr-2 block sm:inline">Jam Operasional:</span>
              <span className="text-slate-600">Senin - Jumat, 07:00 - 16:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
