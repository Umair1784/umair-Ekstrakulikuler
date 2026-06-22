"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  status: z.nativeEnum(AttendanceStatus),
});

export async function updateAttendance(id: string, values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Akses ditolak." };
    }

    if (session.user.role !== Role.ADMIN && session.user.role !== Role.PEMBINA) {
       return { success: false, error: "Akses ditolak." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
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

    const data = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        status: validation.data.status,
      }
    });

    revalidatePath("/admin/attendance");
    revalidatePath("/pembina/attendance");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal memperbarui data absensi." };
  }
}
