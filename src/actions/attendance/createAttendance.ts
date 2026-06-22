"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  extracurricularId: z.string().min(1, "Ekstrakurikuler wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  status: z.nativeEnum(AttendanceStatus),
});

export async function createAttendance(values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Akses ditolak." };
    }
    
    if (session.user.role !== Role.ADMIN && session.user.role !== Role.PEMBINA) {
       return { success: false, error: "Akses ditolak. Hanya Admin atau Pembina." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const { studentId, extracurricularId, date, status } = validation.data;
    const sessionDate = new Date(date);

    if (session.user.role === Role.PEMBINA) {
      const ekskul = await prisma.extracurricular.findFirst({
        where: { id: extracurricularId, coach: { userId: session.user.id } }
      });
      if (!ekskul) {
        return { success: false, error: "Anda tidak memiliki akses ke ekstrakurikuler ini." };
      }
    }

    let attendanceSession = await prisma.attendanceSession.findFirst({
      where: {
        extracurricularId,
        sessionDate,
      }
    });

    if (!attendanceSession) {
      attendanceSession = await prisma.attendanceSession.create({
        data: {
          extracurricularId,
          sessionDate,
          createdById: session.user.id,
        }
      });
    }

    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        sessionId: attendanceSession.id,
        studentId,
      }
    });

    if (existingRecord) {
      return { success: false, error: "Siswa ini sudah memiliki data absensi pada tanggal tersebut." };
    }

    const data = await prisma.attendanceRecord.create({
      data: {
        sessionId: attendanceSession.id,
        studentId,
        status,
        recordedById: session.user.id,
      }
    });

    revalidatePath("/admin/attendance");
    revalidatePath("/pembina/attendance");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal menyimpan data absensi." };
  }
}
