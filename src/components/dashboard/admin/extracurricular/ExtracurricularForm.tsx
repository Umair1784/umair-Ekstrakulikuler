"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExtracurricularStatus } from "@prisma/client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createExtracurricular } from "@/actions/extracurricular/createExtracurricular";
import { updateExtracurricular } from "@/actions/extracurricular/updateExtracurricular";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Maksimal 100 karakter"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  coachId: z.string().min(1, "Pembina wajib dipilih"),
  scheduleSummary: z.string().min(1, "Jadwal wajib diisi"),
  status: z.nativeEnum(ExtracurricularStatus),
});

type FormValues = z.infer<typeof formSchema>;

interface Coach {
  id: string;
  fullName: string;
}

interface ExtracurricularFormProps {
  initialData?: FormValues & { id: string };
  coaches: Coach[];
}

export function ExtracurricularForm({ initialData, coaches }: ExtracurricularFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      coachId: "",
      scheduleSummary: "",
      status: "ACTIVE",
    },
  });

  function onSubmit(data: FormValues) {
    setError(null);
    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateExtracurricular(initialData.id, data);
        } else {
          result = await createExtracurricular(data);
        }

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/extracurricular");
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ekstrakurikuler</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Pramuka" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coachId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pembina</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pembina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coaches.map((coach) => (
                          <SelectItem key={coach.id} value={coach.id}>
                            {coach.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Penjelasan singkat mengenai ekstrakurikuler"
                      disabled={isPending}
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="scheduleSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ringkasan Jadwal</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Setiap Sabtu, 10:00 - 12:00" disabled={isPending} value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Non-Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/extracurricular")}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Simpan Perubahan" : "Tambah Ekstrakurikuler"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
