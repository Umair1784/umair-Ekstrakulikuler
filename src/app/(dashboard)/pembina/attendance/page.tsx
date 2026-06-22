import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Data Absensi",
  description: "Kelola catatan absensi untuk ekstrakurikuler binaan Anda.",
};

import { AttendanceTable } from "@/components/dashboard/attendance/AttendanceTable";
import { AttendanceForm } from "@/components/dashboard/attendance/AttendanceForm";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function PembinaAttendancePage() {
  const user = await requireRole(Role.PEMBINA);

  const myExtracurriculars = await prisma.extracurricular.findMany({
    where: { coach: { userId: user.id }, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const extracurricularIds = myExtracurriculars.map((e) => e.id);

  const [records, students] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: { session: { extracurricularId: { in: extracurricularIds } } },
      orderBy: { session: { sessionDate: "desc" } },
      include: {
        student: { select: { id: true, fullName: true } },
        session: {
          include: { extracurricular: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.student.findMany({
      where: {
        memberships: {
          some: { extracurricularId: { in: extracurricularIds }, status: "ACTIVE" }
        }
      },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Absensi Saya</h1>
          <p className="text-slate-500 mt-1">Kelola catatan absensi untuk ekstrakurikuler binaan Anda.</p>
        </div>
        {myExtracurriculars.length > 0 && (
          <AttendanceForm
            mode="create"
            extracurriculars={myExtracurriculars}
            students={students}
          />
        )}
      </div>
      <AttendanceTable data={records} />
    </div>
  );
}
