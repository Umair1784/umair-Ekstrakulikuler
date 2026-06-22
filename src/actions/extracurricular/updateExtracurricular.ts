"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, ExtracurricularStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Maksimal 100 karakter"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  coachId: z.string().min(1, "Pembina wajib dipilih"),
  scheduleSummary: z.string().min(1, "Jadwal wajib diisi"),
  status: z.nativeEnum(ExtracurricularStatus),
});

export async function updateExtracurricular(id: string, values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const data = await prisma.extracurricular.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath("/admin/extracurricular");
    revalidatePath(`/admin/extracurricular/${id}/edit`);
    revalidatePath("/admin");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal memperbarui data." };
  }
}
