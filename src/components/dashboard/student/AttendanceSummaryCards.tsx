import { Card, CardContent } from "@/components/ui/card";
import { AttendanceStatus } from "@prisma/client";

export function AttendanceSummaryCards({ data }: { data: { status: AttendanceStatus }[] }) {
  const total = data.length;
  const hadir = data.filter((item) => item.status === "HADIR").length;
  const alfa = data.filter((item) => item.status === "ALFA").length;
  const sakit = data.filter((item) => item.status === "SAKIT").length;
  const izin = data.filter((item) => item.status === "IZIN").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="shadow-sm border-slate-200 col-span-2 md:col-span-1">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Absensi</p>
          <p className="text-3xl font-bold text-slate-900">{total}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Hadir</p>
          <p className="text-3xl font-bold text-green-600">{hadir}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Alfa</p>
          <p className="text-3xl font-bold text-red-600">{alfa}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Sakit</p>
          <p className="text-3xl font-bold text-yellow-600">{sakit}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Izin</p>
          <p className="text-3xl font-bold text-blue-600">{izin}</p>
        </CardContent>
      </Card>
    </div>
  );
}
