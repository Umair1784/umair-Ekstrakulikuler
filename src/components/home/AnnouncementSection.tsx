import { Megaphone } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Announcement, Extracurricular } from "@prisma/client";

type AnnouncementWithEkskul = Announcement & { extracurricular: Extracurricular | null };

function getCategory(announcement: AnnouncementWithEkskul) {
  if (announcement.isGlobal) return "Umum";
  const title = announcement.title.toLowerCase();
  if (title.includes("jadwal")) return "Jadwal";
  if (title.includes("kegiatan")) return "Kegiatan";
  if (title.includes("prestasi")) return "Prestasi";
  return announcement.extracurricular?.name || "Kegiatan";
}

export default async function AnnouncementSection() {
  const announcements = await prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 5,
    include: {
      extracurricular: true,
    },
  });

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 mb-6 px-3 py-1 text-sm font-medium">
            Pengumuman
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl mb-4">
            Informasi dan Pengumuman Terbaru
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Ikuti berbagai informasi penting mengenai kegiatan ekstrakurikuler, jadwal, dan agenda sekolah.
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada pengumuman</h3>
            <p className="text-lg text-slate-500">Pengumuman terbaru akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="rounded-xl shadow-sm border-slate-200 flex flex-col h-full bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-orange-600" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                      {getCategory(announcement)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    {announcement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <CardDescription className="text-slate-600 text-base line-clamp-3">
                    {announcement.body}
                  </CardDescription>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 text-sm text-slate-500">
                    {announcement.publishedAt ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(announcement.publishedAt) : "Tanggal tidak tersedia"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
