import { prisma } from "@/lib/db";
import { AnnouncementForm } from "@/components/dashboard/admin/announcements/AnnouncementForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    notFound();
  }

  const initialData = {
    id: announcement.id,
    title: announcement.title,
    summary: announcement.summary || "",
    content: announcement.body,
    category: announcement.category,
    status: announcement.status,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Pengumuman</h1>
          <p className="text-slate-500 mt-1">Perbarui konten dan status pengumuman.</p>
        </div>
      </div>

      <AnnouncementForm initialData={initialData} />
    </div>
  );
}
