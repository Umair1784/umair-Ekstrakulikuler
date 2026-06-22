"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnnouncementStatus, AnnouncementCategory } from "@prisma/client";

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
import { createAnnouncement } from "@/actions/announcements/createAnnouncement";
import { updateAnnouncement } from "@/actions/announcements/updateAnnouncement";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(150, "Maksimal 150 karakter"),
  summary: z.string().min(1, "Ringkasan wajib diisi").max(300, "Maksimal 300 karakter"),
  content: z.string().min(1, "Konten wajib diisi"),
  category: z.nativeEnum(AnnouncementCategory),
  status: z.nativeEnum(AnnouncementStatus),
});

type FormValues = z.infer<typeof formSchema>;

interface AnnouncementFormProps {
  initialData?: FormValues & { id: string };
}

export function AnnouncementForm({ initialData }: AnnouncementFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      summary: "",
      content: "",
      category: "UMUM",
      status: "DRAFT",
    },
  });

  function onSubmit(data: FormValues) {
    setError(null);
    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateAnnouncement(initialData.id, data);
        } else {
          result = await createAnnouncement(data);
        }

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/announcements");
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Pengumuman</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Jadwal Libur Semester" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ringkasan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ringkasan singkat untuk ditampilkan di halaman depan"
                      disabled={isPending}
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Isi lengkap pengumuman"
                      disabled={isPending}
                      className="resize-none"
                      rows={6}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UMUM">Umum</SelectItem>
                        <SelectItem value="JADWAL">Jadwal</SelectItem>
                        <SelectItem value="KEGIATAN">Kegiatan</SelectItem>
                        <SelectItem value="PRESTASI">Prestasi</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Publikasikan</SelectItem>
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
                onClick={() => router.push("/admin/announcements")}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Simpan Perubahan" : "Simpan Pengumuman"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
