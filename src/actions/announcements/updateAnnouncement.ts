"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, AnnouncementStatus, AnnouncementCategory } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(150, "Maksimal 150 karakter"),
  summary: z.string().min(1, "Ringkasan wajib diisi").max(300, "Maksimal 300 karakter"),
  content: z.string().min(1, "Konten wajib diisi"),
  category: z.nativeEnum(AnnouncementCategory),
  status: z.nativeEnum(AnnouncementStatus),
});

export async function updateAnnouncement(id: string, values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Pengumuman tidak ditemukan." };
    }

    let publishedAt = existing.publishedAt;
    if (existing.status !== "PUBLISHED" && validation.data.status === "PUBLISHED") {
      publishedAt = new Date();
    } else if (validation.data.status === "DRAFT") {
      publishedAt = null;
    }

    const data = await prisma.announcement.update({
      where: { id },
      data: {
        title: validation.data.title,
        summary: validation.data.summary,
        body: validation.data.content,
        category: validation.data.category,
        status: validation.data.status,
        publishedAt,
      },
    });

    revalidatePath("/admin/announcements");
    revalidatePath(`/admin/announcements/${id}/edit`);
    revalidatePath("/");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal memperbarui pengumuman." };
  }
}
