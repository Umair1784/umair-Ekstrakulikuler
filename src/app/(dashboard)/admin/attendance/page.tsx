import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Data Absensi",
  description: "Kelola seluruh catatan absensi ekstrakurikuler.",
};

import { AttendanceTable } from "@/components/dashboard/attendance/AttendanceTable";
import { AttendanceForm } from "@/components/dashboard/attendance/AttendanceForm";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function AdminAttendancePage() {
  await requireRole(Role.ADMIN);

  const [records, extracurriculars, students] = await Promise.all([
    prisma.attendanceRecord.findMany({
      orderBy: { session: { sessionDate: "desc" } },
      include: {
        student: { select: { id: true, fullName: true } },
        session: {
          include: { extracurricular: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.extracurricular.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.student.findMany({
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Absensi</h1>
          <p className="text-slate-500 mt-1">Kelola seluruh catatan absensi ekstrakurikuler.</p>
        </div>
        <AttendanceForm
          mode="create"
          extracurriculars={extracurriculars}
          students={students}
        />
      </div>
      <AttendanceTable data={records} />
    </div>
  );
}
