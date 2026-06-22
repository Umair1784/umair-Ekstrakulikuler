import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteAchievementDialog } from "./DeleteAchievementDialog";

type AchievementWithDetails = {
  id: string;
  result: string;
  description: string | null;
  createdAt: Date;
  student: { fullName: string };
  competition: {
    name: string;
    extracurricular: { name: string };
  };
};

const resultLabels: Record<string, string> = {
  JUARA_1: "Juara 1",
  JUARA_2: "Juara 2",
  JUARA_3: "Juara 3",
  JUARA_HARAPAN: "Juara Harapan",
  TIDAK_JUARA: "Tidak Juara",
};

const resultColors: Record<string, string> = {
  JUARA_1: "bg-yellow-100 text-yellow-800",
  JUARA_2: "bg-slate-200 text-slate-700",
  JUARA_3: "bg-orange-100 text-orange-700",
  JUARA_HARAPAN: "bg-blue-100 text-blue-700",
  TIDAK_JUARA: "bg-slate-100 text-slate-600",
};

export function AchievementsTable({ data }: { data: AchievementWithDetails[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500">Belum ada prestasi tercatat</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Siswa</TableHead>
            <TableHead>Kompetisi</TableHead>
            <TableHead>Ekstrakurikuler</TableHead>
            <TableHead>Hasil</TableHead>
            <TableHead>Tanggal Dicatat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-900">{item.student.fullName}</TableCell>
              <TableCell className="text-slate-600">{item.competition.name}</TableCell>
              <TableCell className="text-slate-600">{item.competition.extracurricular.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={resultColors[item.result] || "bg-slate-100 text-slate-600"}>
                  {resultLabels[item.result] || item.result}
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
                <DeleteAchievementDialog id={item.id} studentName={item.student.fullName} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
