import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Kelola pengumuman untuk ditampilkan di halaman utama.",
};

import { AnnouncementsTable } from "@/components/dashboard/admin/announcements/AnnouncementsTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AnnouncementsListPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengumuman</h1>
          <p className="text-slate-500 mt-1">Kelola pengumuman untuk ditampilkan di halaman utama.</p>
        </div>
        {announcements.length > 0 && (
          <Link
            href="/admin/announcements/new"
            className={cn(buttonVariants({ variant: "default" }), "bg-orange-600 hover:bg-orange-700 shrink-0")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Pengumuman
          </Link>
        )}
      </div>
      <AnnouncementsTable data={announcements} />
    </div>
  );
}
