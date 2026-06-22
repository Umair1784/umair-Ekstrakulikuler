"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteExtracurricular(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    await prisma.extracurricular.delete({
      where: { id },
    });

    revalidatePath("/admin/extracurricular");
    revalidatePath("/admin");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "Gagal menghapus data. Mungkin ada data terkait yang mencegah penghapusan." };
  }
}
