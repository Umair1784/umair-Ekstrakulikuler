"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteAttendance(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Akses ditolak." };
    }

    if (session.user.role !== Role.ADMIN && session.user.role !== Role.PEMBINA) {
       return { success: false, error: "Akses ditolak." };
    }

    if (session.user.role === Role.PEMBINA) {
      const record = await prisma.attendanceRecord.findUnique({
        where: { id },
        include: { session: { include: { extracurricular: { include: { coach: true } } } } }
      });
      if (!record || record.session.extracurricular.coach?.userId !== session.user.id) {
        return { success: false, error: "Akses ditolak." };
      }
    }

    await prisma.attendanceRecord.delete({
      where: { id },
    });

    revalidatePath("/admin/attendance");
    revalidatePath("/pembina/attendance");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "Gagal menghapus data absensi." };
  }
}
