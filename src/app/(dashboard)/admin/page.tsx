import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/dashboard/admin/StatsCard";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Ringkasan informasi dan aktivitas sistem ekstrakurikuler.",
};

import { RecentAnnouncementsCard } from "@/components/dashboard/admin/RecentAnnouncementsCard";
import { RecentAchievementsCard } from "@/components/dashboard/admin/RecentAchievementsCard";
import { BookOpen, Users, UserSquare2, Megaphone } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalEkskul, totalStudents, totalCoaches, totalAnnouncements] = await Promise.all([
    prisma.extracurricular.count(),
    prisma.student.count(),
    prisma.coach.count(),
    prisma.announcement.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Ringkasan informasi dan aktivitas sistem ekstrakurikuler.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Ekstrakurikuler"
          value={totalEkskul}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Siswa"
          value={totalStudents}
          icon={Users}
        />
        <StatsCard
          title="Total Pembina"
          value={totalCoaches}
          icon={UserSquare2}
        />
        <StatsCard
          title="Total Pengumuman"
          value={totalAnnouncements}
          icon={Megaphone}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAnnouncementsCard />
        <RecentAchievementsCard />
      </div>
    </div>
  );
}
