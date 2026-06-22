import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard Orang Tua",
  description: "Pantau perkembangan dan aktivitas ekstrakurikuler anak Anda.",
};

import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

import { ChildProfileCard } from "@/components/dashboard/parent/ChildProfileCard";
import { ChildExtracurricularCard } from "@/components/dashboard/parent/ChildExtracurricularCard";
import { AttendanceOverviewCard } from "@/components/dashboard/parent/AttendanceOverviewCard";
import { AttendanceHistoryTable } from "@/components/dashboard/parent/AttendanceHistoryTable";

export default async function OrangTuaDashboardPage() {
  const user = await requireRole(Role.ORANG_TUA);

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: {
      studentLinks: {
        include: {
          student: true,
        },
      },
    },
  });

  const child = parent?.studentLinks?.[0]?.student;

  if (!child) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Orang Tua</h1>
          <p className="text-slate-500 mt-1">Pantau perkembangan dan aktivitas ekstrakurikuler anak Anda.</p>
        </div>
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Belum ada data</h3>
          <p className="text-slate-500">Data kegiatan dan absensi anak akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  const [extracurriculars, attendanceRecords] = await Promise.all([
    prisma.extracurricular.findMany({
      where: {
        memberships: {
          some: { studentId: child.id, status: "ACTIVE" },
        },
      },
      include: {
        coach: { select: { fullName: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.attendanceRecord.findMany({
      where: { studentId: child.id },
      orderBy: { session: { sessionDate: "desc" } },
      include: {
        session: {
          include: {
            extracurricular: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Orang Tua</h1>
        <p className="text-slate-500 mt-1">Pantau perkembangan dan aktivitas ekstrakurikuler anak Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChildProfileCard data={child} />
        <AttendanceOverviewCard data={attendanceRecords} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChildExtracurricularCard data={extracurriculars} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Riwayat Kehadiran</h2>
        <AttendanceHistoryTable data={attendanceRecords} />
      </div>
    </div>
  );
}
