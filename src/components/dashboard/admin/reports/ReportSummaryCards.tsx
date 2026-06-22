import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, BookOpen } from "lucide-react";

export function ReportSummaryCards({ totalStudents, totalAttendance, totalEkskul }: { totalStudents: number, totalAttendance: number, totalEkskul: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" /> Total Siswa Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-orange-600" /> Total Data Absensi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-900">{totalAttendance}</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-orange-600" /> Ekstrakurikuler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-900">{totalEkskul}</p>
        </CardContent>
      </Card>
    </div>
  );
}
