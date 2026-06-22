import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStatus } from "@prisma/client";

export function AttendanceOverviewCard({ data }: { data: { status: AttendanceStatus }[] }) {
  const total = data.length;
  const hadir = data.filter((item) => item.status === "HADIR").length;
  const alfa = data.filter((item) => item.status === "ALFA").length;
  const sakit = data.filter((item) => item.status === "SAKIT").length;
  const izin = data.filter((item) => item.status === "IZIN").length;
  const terlambat = data.filter((item) => item.status === "TERLAMBAT").length;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900">Ringkasan Kehadiran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Hadir</p>
            <p className="text-2xl font-bold text-green-700">{hadir}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Alfa</p>
            <p className="text-2xl font-bold text-red-700">{alfa}</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Sakit</p>
            <p className="text-2xl font-bold text-yellow-700">{sakit}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Izin</p>
            <p className="text-2xl font-bold text-blue-700">{izin}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-xs font-medium text-slate-500 mb-1">Terlambat</p>
            <p className="text-2xl font-bold text-orange-700">{terlambat}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
