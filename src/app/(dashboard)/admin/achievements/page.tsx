import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kompetisi & Prestasi",
  description: "Kelola data kompetisi dan catat prestasi siswa.",
};

import { CompetitionsTable } from "@/components/dashboard/admin/achievements/CompetitionsTable";
import { AchievementsTable } from "@/components/dashboard/admin/achievements/AchievementsTable";
import { AddAchievementDialog } from "@/components/dashboard/admin/achievements/AddAchievementDialog";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AchievementsPage() {
  const [competitions, achievements, students] = await Promise.all([
    prisma.competition.findMany({
      orderBy: { eventDate: "desc" },
      include: {
        extracurricular: true,
        _count: { select: { achievements: true } },
      },
    }),
    prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        competition: {
          include: { extracurricular: true },
        },
      },
    }),
    prisma.student.findMany({
      orderBy: { fullName: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Competitions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kompetisi & Prestasi</h1>
            <p className="text-slate-500 mt-1">Kelola data kompetisi dan catat prestasi siswa.</p>
          </div>
          <div className="flex gap-3">
            <AddAchievementDialog
              competitions={competitions}
              students={students}
            />
            <Link
              href="/admin/achievements/new"
              className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kompetisi
            </Link>
          </div>
        </div>
        <CompetitionsTable data={competitions} />
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Daftar Prestasi</h2>
        <AchievementsTable data={achievements} />
      </div>
    </div>
  );
}
