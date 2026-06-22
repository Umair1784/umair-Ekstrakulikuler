import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { AttendanceStatus } from "@prisma/client";

type AttendanceRecordWithDetails = {
  id: string;
  status: AttendanceStatus;
  session: {
    sessionDate: Date;
    extracurricular: { name: string };
  };
};

export function AttendanceHistoryTable({ data }: { data: AttendanceRecordWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Belum ada data</h3>
        <p className="text-slate-500">Data absensi anak akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Ekstrakurikuler</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(item.session.sessionDate)}
              </TableCell>
              <TableCell className="text-slate-600">{item.session.extracurricular.name}</TableCell>
              <TableCell>
                <AttendanceStatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
