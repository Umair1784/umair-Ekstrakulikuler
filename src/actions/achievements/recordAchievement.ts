"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, AchievementResult } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  competitionId: z.string().min(1, "Kompetisi wajib dipilih"),
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  result: z.nativeEnum(AchievementResult),
  description: z.string().optional(),
});

export async function recordAchievement(values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const data = await prisma.achievement.create({
      data: {
        competitionId: validation.data.competitionId,
        studentId: validation.data.studentId,
        result: validation.data.result,
        description: validation.data.description || null,
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal menyimpan data prestasi." };
  }
}
