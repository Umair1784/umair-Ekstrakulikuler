import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Laporan & Ekspor",
  description: "Buat dan unduh laporan aktivitas ekstrakurikuler.",
};

import { Role } from "@prisma/client";
import { ReportFilters } from "@/components/dashboard/admin/reports/ReportFilters";
import { ReportSummaryCards } from "@/components/dashboard/admin/reports/ReportSummaryCards";
import { ExportExcelButton } from "@/components/dashboard/admin/reports/ExportExcelButton";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ ekskul?: string, startDate?: string, endDate?: string }> }) {
  await requireRole(Role.ADMIN);

  const sp = await searchParams;

  const sessionWhere: import("@prisma/client").Prisma.AttendanceSessionWhereInput = {};
  if (sp.ekskul && sp.ekskul !== "all") {
    sessionWhere.extracurricularId = sp.ekskul;
  }
  if (sp.startDate || sp.endDate) {
    const dateFilter: import("@prisma/client").Prisma.DateTimeFilter = {};
    if (sp.startDate) dateFilter.gte = new Date(sp.startDate);
    if (sp.endDate) dateFilter.lte = new Date(sp.endDate);
    sessionWhere.sessionDate = dateFilter;
  }

  const attendanceWhere: import("@prisma/client").Prisma.AttendanceRecordWhereInput = {
    ...(Object.keys(sessionWhere).length > 0 && { session: sessionWhere }),
  };

  const [attendanceRecords, extracurriculars, totalStudents] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: attendanceWhere,
      include: {
        student: { select: { fullName: true } },
        session: { include: { extracurricular: { select: { name: true } } } },
      },
      orderBy: { session: { sessionDate: 'desc' } },
    }),
    prisma.extracurricular.findMany({
      include: {
        coach: { select: { fullName: true } },
        _count: { select: { memberships: { where: { status: "ACTIVE" } } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.student.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan & Ekspor</h1>
        <p className="text-slate-500 mt-1">Buat dan unduh laporan aktivitas ekstrakurikuler dalam format PDF.</p>
      </div>

      <ReportFilters extracurriculars={extracurriculars} />

      <ReportSummaryCards
        totalStudents={totalStudents}
        totalAttendance={attendanceRecords.length}
        totalEkskul={extracurriculars.length}
      />

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900">Ekspor Data (PDF & Excel)</h3>
        {attendanceRecords.length === 0 && extracurriculars.length === 0 ? (
          <div className="text-center py-8">
            <h4 className="text-lg font-medium text-slate-900">Belum ada data laporan</h4>
            <p className="text-slate-500">Data laporan akan tersedia setelah aktivitas sistem berjalan.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <ExportExcelButton type="attendance" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <ExportExcelButton type="extracurricular" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
