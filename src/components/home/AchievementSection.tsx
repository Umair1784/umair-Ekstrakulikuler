import { Trophy } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompetitionLevel } from "@prisma/client";

function formatLevel(level: CompetitionLevel) {
  switch (level) {
    case CompetitionLevel.SEKOLAH:
      return "Sekolah";
    case CompetitionLevel.KECAMATAN:
      return "Kecamatan";
    case CompetitionLevel.KOTA_KABUPATEN:
      return "Kabupaten";
    case CompetitionLevel.PROVINSI:
      return "Provinsi";
    case CompetitionLevel.NASIONAL:
      return "Nasional";
    case CompetitionLevel.INTERNASIONAL:
      return "Internasional";
    default:
      return level;
  }
}

export default async function AchievementSection() {
  const achievements = await prisma.achievement.findMany({
    orderBy: {
      competition: {
        eventDate: "desc",
      },
    },
    take: 6,
    include: {
      competition: {
        include: {
          extracurricular: true,
        },
      },
    },
  });

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 mb-6 px-3 py-1 text-sm font-medium">
            Prestasi
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl mb-4">
            Prestasi yang Membanggakan
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Berbagai pencapaian siswa dalam kegiatan ekstrakurikuler yang mengharumkan nama sekolah.
          </p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-medium text-slate-900 mb-2">Belum ada prestasi</h3>
            <p className="text-lg text-slate-500">Prestasi ekstrakurikuler akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="rounded-xl shadow-sm border-slate-200 flex flex-col h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    {achievement.competition.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {achievement.description && (
                    <CardDescription className="text-slate-600 text-base line-clamp-3">
                      {achievement.description}
                    </CardDescription>
                  )}
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{achievement.competition.extracurricular.name}</span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                        {formatLevel(achievement.competition.level)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(achievement.competition.eventDate)}
                      </span>
                    </div>
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
