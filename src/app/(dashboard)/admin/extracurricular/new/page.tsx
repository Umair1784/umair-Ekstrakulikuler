import { prisma } from "@/lib/db";
import { ExtracurricularForm } from "@/components/dashboard/admin/extracurricular/ExtracurricularForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewExtracurricularPage() {
  const coaches = await prisma.coach.findMany({
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/extracurricular" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tambah Ekstrakurikuler</h1>
          <p className="text-slate-500 mt-1">Buat data ekstrakurikuler baru ke dalam sistem.</p>
        </div>
      </div>

      <ExtracurricularForm coaches={coaches} />
    </div>
  );
}
