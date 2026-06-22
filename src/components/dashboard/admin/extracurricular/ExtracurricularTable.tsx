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
import { DeleteExtracurricularDialog } from "./DeleteExtracurricularDialog";
import { cn } from "@/lib/utils";

type ExtracurricularWithDetails = {
  id: string;
  name: string;
  coach: { fullName: string };
  status: string;
  createdAt: Date;
  _count: { memberships: number };
};

export function ExtracurricularTable({ data }: { data: ExtracurricularWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 mb-4">Belum ada ekstrakurikuler</p>
        <Link
          href="/admin/extracurricular/new"
          className={cn(buttonVariants({ variant: "default" }), "bg-orange-600 hover:bg-orange-700")}
        >
          Tambah Ekstrakurikuler
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Pembina</TableHead>
            <TableHead className="text-center">Anggota</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
              <TableCell className="text-slate-600">{item.coach.fullName}</TableCell>
              <TableCell className="text-center text-slate-600">{item._count.memberships}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    item.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }
                >
                  {item.status === "ACTIVE" ? "Aktif" : "Non-Aktif"}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(item.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/extracurricular/${item.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                    )}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteExtracurricularDialog id={item.id} name={item.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
