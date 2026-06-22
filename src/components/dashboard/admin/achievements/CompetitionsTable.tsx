import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { DeleteCompetitionDialog } from "./DeleteCompetitionDialog";
import { cn } from "@/lib/utils";

type CompetitionWithDetails = {
  id: string;
  name: string;
  level: string;
  location: string;
  eventDate: Date;
  status: string;
  extracurricular: { name: string };
  _count: { achievements: number };
};

const levelLabels: Record<string, string> = {
  SEKOLAH: "Sekolah",
  KECAMATAN: "Kecamatan",
  KOTA_KABUPATEN: "Kota/Kabupaten",
  PROVINSI: "Provinsi",
  NASIONAL: "Nasional",
  INTERNASIONAL: "Internasional",
};

const statusLabels: Record<string, string> = {
  BELUM_MENGIKUTI: "Belum Mengikuti",
  MENGIKUTI: "Mengikuti",
  MENUNGGU_HASIL: "Menunggu Hasil",
  SELESAI: "Selesai",
};

const statusColors: Record<string, string> = {
  BELUM_MENGIKUTI: "bg-slate-100 text-slate-700",
  MENGIKUTI: "bg-blue-100 text-blue-700",
  MENUNGGU_HASIL: "bg-amber-100 text-amber-700",
  SELESAI: "bg-green-100 text-green-700",
};

export function CompetitionsTable({ data }: { data: CompetitionWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 mb-4">Belum ada kompetisi</p>
        <Link
          href="/admin/achievements/new"
          className={cn(buttonVariants({ variant: "default" }), "bg-orange-600 hover:bg-orange-700")}
        >
          Tambah Kompetisi
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Nama Kompetisi</TableHead>
            <TableHead>Ekstrakurikuler</TableHead>
            <TableHead>Tingkat</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-center">Prestasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">{item.name}</TableCell>
              <TableCell className="text-slate-600">{item.extracurricular.name}</TableCell>
              <TableCell className="text-slate-600">{levelLabels[item.level] || item.level}</TableCell>
              <TableCell className="text-slate-500 text-sm">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(item.eventDate)}
              </TableCell>
              <TableCell className="text-center text-slate-600">{item._count.achievements}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[item.status] || "bg-slate-100 text-slate-700"}>
                  {statusLabels[item.status] || item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/achievements/${item.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                    )}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteCompetitionDialog id={item.id} name={item.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
