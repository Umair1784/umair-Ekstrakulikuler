"use server";

import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export async function generateExtracurricularExcelBase64() {
  const session = await auth();
  if (session?.user?.role !== Role.ADMIN) throw new Error("Unauthorized");

  const records = await prisma.extracurricular.findMany({
    include: {
      coach: { select: { fullName: true } },
      _count: { select: { memberships: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { name: 'asc' },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Extracurricular Report");

  worksheet.addRow(["SMA Negeri Contoh"]);
  worksheet.addRow(["Laporan Data Ekstrakurikuler"]);
  worksheet.addRow([`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`]);
  worksheet.addRow([]);

  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(2).font = { bold: true, size: 12 };

  const headerRow = worksheet.addRow(["Nama Ekstrakurikuler", "Nama Pembina", "Total Anggota", "Status"]);
  headerRow.font = { bold: true };

  records.forEach(r => {
    worksheet.addRow([
      r.name,
      r.coach.fullName,
      r._count.memberships,
      r.status
    ]);
  });

  worksheet.columns.forEach(column => { column.width = 25; });
  worksheet.views = [{ state: 'frozen', ySplit: 5 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString('base64');
}
