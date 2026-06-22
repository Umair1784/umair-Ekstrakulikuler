import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { AttendanceForm } from "./AttendanceForm";
import { DeleteAttendanceDialog } from "./DeleteAttendanceDialog";
import { AttendanceStatus } from "@prisma/client";

type AttendanceRecordWithDetails = {
  id: string;
  status: AttendanceStatus;
  student: { id: string; fullName: string };
  session: {
    sessionDate: Date;
    extracurricular: { id: string; name: string };
  };
};

export function AttendanceTable({ data }: { data: AttendanceRecordWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500">Belum ada data absensi</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Nama Siswa</TableHead>
            <TableHead>Ekstrakurikuler</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900">{item.student.fullName}</TableCell>
              <TableCell className="text-slate-600">{item.session.extracurricular.name}</TableCell>
              <TableCell className="text-slate-500 text-sm">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(item.session.sessionDate)}
              </TableCell>
              <TableCell>
                <AttendanceStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <AttendanceForm
                    mode="edit"
                    initialData={{
                      id: item.id,
                      studentId: item.student.id,
                      extracurricularId: item.session.extracurricular.id,
                      date: item.session.sessionDate.toISOString().split("T")[0],
                      status: item.status,
                    }}
                  />
                  <DeleteAttendanceDialog id={item.id} studentName={item.student.fullName} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
