import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Megaphone } from "lucide-react";

export async function RecentAnnouncementsCard() {
  const announcements = await prisma.announcement.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  return (
    <Card className="rounded-xl shadow-sm border-slate-200 bg-white h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-orange-600" />
          Pengumuman Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <div className="text-center py-6 text-slate-500">Belum ada pengumuman</div>
        ) : (
          <ul className="space-y-4">
            {announcements.map((item) => (
              <li key={item.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {item.publishedAt ? new Intl.DateTimeFormat("id-ID", {
                    day: "numeric", month: "short", year: "numeric"
                  }).format(item.publishedAt) : "-"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
