import { prisma } from "@/lib/db";
import { ExtracurricularForm } from "@/components/dashboard/admin/extracurricular/ExtracurricularForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditExtracurricularPage({ params }: { params: { id: string } }) {
  const [extracurricular, coaches] = await Promise.all([
    prisma.extracurricular.findUnique({
      where: { id: params.id },
    }),
    prisma.coach.findMany({
      orderBy: { fullName: "asc" },
    }),
  ]);

  if (!extracurricular) {
    notFound();
  }

  const initialData = {
    id: extracurricular.id,
    name: extracurricular.name,
    description: extracurricular.description,
    coachId: extracurricular.coachId,
    scheduleSummary: extracurricular.scheduleSummary || "",
    status: extracurricular.status,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/extracurricular" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Ekstrakurikuler</h1>
          <p className="text-slate-500 mt-1">Perbarui data ekstrakurikuler yang sudah ada.</p>
        </div>
      </div>

      <ExtracurricularForm initialData={initialData} coaches={coaches} />
    </div>
  );
}
