import { prisma } from "@/lib/db";
import { CompetitionForm } from "@/components/dashboard/admin/achievements/CompetitionForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCompetitionPage({ params }: { params: { id: string } }) {
  const [competition, extracurriculars] = await Promise.all([
    prisma.competition.findUnique({
      where: { id: params.id },
    }),
    prisma.extracurricular.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!competition) {
    notFound();
  }

  const initialData = {
    id: competition.id,
    name: competition.name,
    extracurricularId: competition.extracurricularId,
    level: competition.level,
    location: competition.location,
    eventDate: competition.eventDate.toISOString().split("T")[0],
    status: competition.status,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/achievements" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Kompetisi</h1>
          <p className="text-slate-500 mt-1">Perbarui data kompetisi yang sudah ada.</p>
        </div>
      </div>

      <CompetitionForm initialData={initialData} extracurriculars={extracurriculars} />
    </div>
  );
}
