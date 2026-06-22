import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Riwayat Kehadiran",
  description: "Pantau riwayat kehadiran Anda di setiap ekstrakurikuler.",
};

import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { AttendanceHistoryTable } from "@/components/dashboard/student/AttendanceHistoryTable";
import { AttendanceSummaryCards } from "@/components/dashboard/student/AttendanceSummaryCards";

export default async function SiswaAttendancePage() {
  const user = await requireRole(Role.SISWA);

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
  });

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Kehadiran</h1>
          <p className="text-slate-500 mt-1">Pantau kehadiran Anda di setiap ekstrakurikuler.</p>
        </div>
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Data Siswa Tidak Ditemukan</h3>
          <p className="text-slate-500">Silakan hubungi administrator sekolah.</p>
        </div>
      </div>
    );
  }

  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: student.id },
    orderBy: { session: { sessionDate: "desc" } },
    include: {
      session: {
        include: {
          extracurricular: {
            select: { name: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Kehadiran</h1>
        <p className="text-slate-500 mt-1">Pantau kehadiran Anda di setiap ekstrakurikuler.</p>
      </div>

      {records.length > 0 && <AttendanceSummaryCards data={records} />}
      
      <AttendanceHistoryTable data={records} />
    </div>
  );
}
