"use server";

import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export async function generateAttendanceExcelBase64(filters: { ekskul?: string, startDate?: string, endDate?: string }) {
  const session = await auth();
  if (session?.user?.role !== Role.ADMIN) throw new Error("Unauthorized");

  const sessionWhere: import("@prisma/client").Prisma.AttendanceSessionWhereInput = {};
  if (filters.ekskul && filters.ekskul !== "all") {
    sessionWhere.extracurricularId = filters.ekskul;
  }
  if (filters.startDate || filters.endDate) {
    const dateFilter: import("@prisma/client").Prisma.DateTimeFilter = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    sessionWhere.sessionDate = dateFilter;
  }

  const where: import("@prisma/client").Prisma.AttendanceRecordWhereInput = {
    ...(Object.keys(sessionWhere).length > 0 && { session: sessionWhere }),
  };

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      student: { select: { fullName: true, nisn: true } },
      session: { include: { extracurricular: { select: { name: true } } } },
    },
    orderBy: { session: { sessionDate: 'desc' } },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance Report");

  worksheet.addRow(["SMA Negeri Contoh"]);
  worksheet.addRow(["Laporan Kehadiran Ekstrakurikuler"]);
  worksheet.addRow([`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`]);
  worksheet.addRow([]);

  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(2).font = { bold: true, size: 12 };

  const headerRow = worksheet.addRow(["Nama Siswa", "NISN", "Ekstrakurikuler", "Tanggal", "Status"]);
  headerRow.font = { bold: true };

  records.forEach(r => {
    worksheet.addRow([
      r.student.fullName,
      r.student.nisn,
      r.session.extracurricular.name,
      new Date(r.session.sessionDate).toLocaleDateString("id-ID"),
      r.status
    ]);
  });

  worksheet.columns.forEach(column => { column.width = 20; });
  worksheet.views = [{ state: 'frozen', ySplit: 5 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString('base64');
}
