"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteCompetition(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    await prisma.competition.delete({
      where: { id },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "Gagal menghapus kompetisi. Mungkin ada data prestasi terkait." };
  }
}
