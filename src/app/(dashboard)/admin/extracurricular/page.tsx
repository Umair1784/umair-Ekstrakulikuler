import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  description: "Kelola data ekstrakurikuler, pembina, dan jadwal.",
};

import { ExtracurricularTable } from "@/components/dashboard/admin/extracurricular/ExtracurricularTable";

export default async function ExtracurricularListPage() {
  const extracurriculars = await prisma.extracurricular.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      coach: true,
      _count: {
        select: { memberships: { where: { status: "ACTIVE" } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ekstrakurikuler</h1>
          <p className="text-slate-500 mt-1">Kelola data ekstrakurikuler, pembina, dan jadwal.</p>
        </div>
      </div>
      <ExtracurricularTable data={extracurriculars} />
    </div>
  );
}
