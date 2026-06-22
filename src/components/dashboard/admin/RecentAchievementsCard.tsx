import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Trophy } from "lucide-react";

export async function RecentAchievementsCard() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      competition: {
        include: {
          extracurricular: true,
        },
      },
    },
  });

  return (
    <Card className="rounded-xl shadow-sm border-slate-200 bg-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-600" />
          Prestasi Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-slate-500">Belum ada prestasi</div>
        ) : (
          <ul className="space-y-4">
            {achievements.map((item) => (
              <li key={item.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.competition.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-orange-600 font-medium">
                    {item.competition.extracurricular.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    }).format(item.competition.eventDate)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
