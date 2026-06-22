"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, CompetitionLevel, CompetitionStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1, "Nama kompetisi wajib diisi").max(150, "Maksimal 150 karakter"),
  extracurricularId: z.string().min(1, "Ekstrakurikuler wajib dipilih"),
  level: z.nativeEnum(CompetitionLevel),
  location: z.string().min(1, "Lokasi wajib diisi"),
  eventDate: z.string().min(1, "Tanggal wajib diisi"),
  status: z.nativeEnum(CompetitionStatus),
});

export async function createCompetition(values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const data = await prisma.competition.create({
      data: {
        name: validation.data.name,
        extracurricularId: validation.data.extracurricularId,
        level: validation.data.level,
        location: validation.data.location,
        eventDate: new Date(validation.data.eventDate),
        status: validation.data.status,
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal menyimpan data kompetisi." };
  }
}
