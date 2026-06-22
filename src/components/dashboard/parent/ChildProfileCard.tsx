import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

type ChildProfileProps = {
  fullName: string;
  nisn: string;
  className: string;
  gender: string;
};

export function ChildProfileCard({ data }: { data: ChildProfileProps }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-600" />
          Profil Anak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm font-medium text-slate-500">Nama Lengkap</p>
            <p className="text-base font-semibold text-slate-900">{data.fullName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">NISN</p>
              <p className="text-base text-slate-900">{data.nisn}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Kelas</p>
              <p className="text-base text-slate-900">{data.className}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Jenis Kelamin</p>
              <p className="text-base text-slate-900">
                {data.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
