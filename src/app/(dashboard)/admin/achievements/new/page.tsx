import { prisma } from "@/lib/db";
import { CompetitionForm } from "@/components/dashboard/admin/achievements/CompetitionForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewCompetitionPage() {
  const extracurriculars = await prisma.extracurricular.findMany({
    orderBy: { name: "asc" },
    where: { status: "ACTIVE" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/achievements" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tambah Kompetisi</h1>
          <p className="text-slate-500 mt-1">Daftarkan kompetisi baru ke dalam sistem.</p>
        </div>
      </div>

      <CompetitionForm extracurriculars={extracurriculars} />
    </div>
  );
}
