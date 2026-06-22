import { Badge } from "@/components/ui/badge";
import { AttendanceStatus } from "@prisma/client";

const statusColors: Record<AttendanceStatus, string> = {
  HADIR: "bg-green-100 text-green-700",
  ALFA: "bg-red-100 text-red-700",
  SAKIT: "bg-yellow-100 text-yellow-700",
  IZIN: "bg-blue-100 text-blue-700",
  TERLAMBAT: "bg-orange-100 text-orange-700",
};

const statusLabels: Record<AttendanceStatus, string> = {
  HADIR: "Hadir",
  ALFA: "Alfa",
  SAKIT: "Sakit",
  IZIN: "Izin",
  TERLAMBAT: "Terlambat",
};

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return (
    <Badge variant="secondary" className={statusColors[status] || "bg-slate-100 text-slate-700"}>
      {statusLabels[status] || status}
    </Badge>
  );
}
