import { Users, Calendar, ClipboardCheck, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutSection() {
  const features = [
    {
      title: "Manajemen Anggota",
      description: "Kelola data anggota dan pembina dengan lebih mudah.",
      icon: Users,
    },
    {
      title: "Jadwal Kegiatan",
      description: "Atur jadwal latihan dan kegiatan secara terstruktur.",
      icon: Calendar,
    },
    {
      title: "Absensi Digital",
      description: "Pantau kehadiran anggota secara cepat dan akurat.",
      icon: ClipboardCheck,
    },
    {
      title: "Prestasi dan Pengumuman",
      description: "Bagikan informasi dan dokumentasi pencapaian ekstrakurikuler.",
      icon: Trophy,
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 mb-6">
            Tentang EkskulKu
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl mb-4">
            Platform Modern untuk Mengelola Kegiatan Ekstrakurikuler
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            EkskulKu membantu sekolah mengelola kegiatan ekstrakurikuler secara lebih terstruktur, transparan, dan mudah diakses oleh siswa, pembina, serta orang tua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="rounded-xl shadow-sm border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
