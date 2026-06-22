"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CompetitionLevel, CompetitionStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createCompetition } from "@/actions/achievements/createCompetition";
import { updateCompetition } from "@/actions/achievements/updateCompetition";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Nama kompetisi wajib diisi").max(150, "Maksimal 150 karakter"),
  extracurricularId: z.string().min(1, "Ekstrakurikuler wajib dipilih"),
  level: z.nativeEnum(CompetitionLevel),
  location: z.string().min(1, "Lokasi wajib diisi"),
  eventDate: z.string().min(1, "Tanggal wajib diisi"),
  status: z.nativeEnum(CompetitionStatus),
});

type FormValues = z.infer<typeof formSchema>;

interface Extracurricular {
  id: string;
  name: string;
}

interface CompetitionFormProps {
  initialData?: FormValues & { id: string };
  extracurriculars: Extracurricular[];
}

const levelLabels: Record<CompetitionLevel, string> = {
  SEKOLAH: "Sekolah",
  KECAMATAN: "Kecamatan",
  KOTA_KABUPATEN: "Kota/Kabupaten",
  PROVINSI: "Provinsi",
  NASIONAL: "Nasional",
  INTERNASIONAL: "Internasional",
};

const statusLabels: Record<CompetitionStatus, string> = {
  BELUM_MENGIKUTI: "Belum Mengikuti",
  MENGIKUTI: "Mengikuti",
  MENUNGGU_HASIL: "Menunggu Hasil",
  SELESAI: "Selesai",
};

export function CompetitionForm({ initialData, extracurriculars }: CompetitionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      extracurricularId: "",
      level: "SEKOLAH",
      location: "",
      eventDate: "",
      status: "BELUM_MENGIKUTI",
    },
  });

  function onSubmit(data: FormValues) {
    setError(null);
    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateCompetition(initialData.id, data);
        } else {
          result = await createCompetition(data);
        }

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/achievements");
          router.refresh();
        }
      } catch (_e) {
        setError("Terjadi kesalahan sistem.");
      }
    });
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kompetisi</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Olimpiade Sains Nasional" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="extracurricularId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ekstrakurikuler</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih ekstrakurikuler" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {extracurriculars.map((ekskul) => (
                          <SelectItem key={ekskul.id} value={ekskul.id}>
                            {ekskul.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tingkat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(levelLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Universitas Indonesia, Depok" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Pelaksanaan</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/achievements")}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Simpan Perubahan" : "Tambah Kompetisi"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
