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

export async function createAnnouncement(values: z.infer<typeof schema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) {
      return { success: false, error: "Akses ditolak." };
    }
    if (!session.user.id) {
      return { success: false, error: "User ID tidak ditemukan." };
    }

    const validation = schema.safeParse(values);
    if (!validation.success) {
      return { success: false, error: "Validasi gagal", fieldErrors: validation.error.flatten().fieldErrors };
    }

    const data = await prisma.announcement.create({
      data: {
        title: validation.data.title,
        summary: validation.data.summary,
        body: validation.data.content,
        category: validation.data.category,
        status: validation.data.status,
        isGlobal: true,
        createdById: session.user.id,
        publishedAt: validation.data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true, data };
  } catch (_error) {
    return { success: false, error: "Gagal menyimpan pengumuman." };
  }
}
