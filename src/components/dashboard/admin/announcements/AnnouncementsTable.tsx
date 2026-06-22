import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { DeleteAnnouncementDialog } from "./DeleteAnnouncementDialog";
import { cn } from "@/lib/utils";

type AnnouncementWithDetails = {
  id: string;
  title: string;
  category: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
};

export function AnnouncementsTable({ data }: { data: AnnouncementWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 mb-4">Belum ada pengumuman</p>
        <Link
          href="/admin/announcements/new"
          className={cn(buttonVariants({ variant: "default" }), "bg-orange-600 hover:bg-orange-700")}
        >
          Buat Pengumuman
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead>Tanggal Publikasi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">{item.title}</TableCell>
              <TableCell className="text-slate-600">{item.category}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    item.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }
                >
                  {item.status === "PUBLISHED" ? "Dipublikasikan" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(item.createdAt)}
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {item.publishedAt ? new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(item.publishedAt) : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/announcements/${item.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                    )}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteAnnouncementDialog id={item.id} title={item.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
