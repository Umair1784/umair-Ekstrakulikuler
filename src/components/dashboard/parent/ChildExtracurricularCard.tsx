import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type ExtracurricularProps = {
  id: string;
  name: string;
  coach: { fullName: string };
  scheduleSummary: string | null;
};

export function ChildExtracurricularCard({ data }: { data: ExtracurricularProps[] }) {
  return (
    <Card className="shadow-sm border-slate-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-600" />
          Ekstrakurikuler Anak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-slate-500 text-sm mt-2">Anak belum tergabung di ekstrakurikuler mana pun.</p>
        ) : (
          <ul className="space-y-4 mt-2">
            {data.map((item) => (
              <li key={item.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <div className="mt-1 text-sm text-slate-600 grid grid-cols-[80px_1fr] gap-1">
                  <span className="font-medium text-slate-500">Pembina:</span>
                  <span>{item.coach.fullName}</span>
                  <span className="font-medium text-slate-500">Jadwal:</span>
                  <span>{item.scheduleSummary || "Belum ada jadwal"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
