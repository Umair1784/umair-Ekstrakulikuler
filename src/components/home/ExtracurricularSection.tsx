import Link from "next/link";
import { Users, Calendar, Activity } from "lucide-react";
import { prisma } from "@/lib/db";
import { ExtracurricularStatus, MembershipStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function ExtracurricularSection() {
  const extracurriculars = await prisma.extracurricular.findMany({
    where: {
      status: ExtracurricularStatus.ACTIVE,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      coach: true,
      schedules: true,
      _count: {
        select: {
          memberships: {
            where: {
              status: MembershipStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 mb-6">
            Ekstrakurikuler
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl mb-4">
            Pilihan Ekstrakurikuler untuk Mengembangkan Potensi
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Temukan berbagai kegiatan yang membantu siswa berkembang dalam bidang akademik maupun non-akademik.
          </p>
        </div>

        {extracurriculars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-lg text-slate-500">Belum ada ekstrakurikuler tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {extracurriculars.map((ekskul) => (
              <Card key={ekskul.id} className="rounded-xl shadow-sm border-slate-200 flex flex-col h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{ekskul.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <CardDescription className="text-slate-600 text-base line-clamp-3">
                    {ekskul.description}
                  </CardDescription>
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span>{ekskul._count.memberships} Anggota</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-xs uppercase px-2 py-0.5 bg-slate-100 rounded-md shrink-0">Pembina</span>
                      <span className="truncate">{ekskul.coach.fullName}</span>
                    </div>
                    {ekskul.schedules.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-2">
                          {ekskul.schedules.map(s => s.dayOfWeek.charAt(0) + s.dayOfWeek.slice(1).toLowerCase()).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/ekstrakurikuler/${ekskul.id}`}
                    className={buttonVariants({ variant: "outline", className: "w-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700" })}
                  >
                    Lihat Detail
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
