"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AttendanceStatus } from "@prisma/client";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createAttendance } from "@/actions/attendance/createAttendance";
import { updateAttendance } from "@/actions/attendance/updateAttendance";
import { Loader2, Plus, Edit } from "lucide-react";

const createSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  extracurricularId: z.string().min(1, "Ekstrakurikuler wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  status: z.nativeEnum(AttendanceStatus),
});

const updateSchema = z.object({
  status: z.nativeEnum(AttendanceStatus),
});

interface Extracurricular {
  id: string;
  name: string;
}

interface Student {
  id: string;
  fullName: string;
}

interface AttendanceFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    studentId: string;
    extracurricularId: string;
    date: string;
    status: AttendanceStatus;
  };
  extracurriculars?: Extracurricular[];
  students?: Student[];
}

const statusLabels: Record<AttendanceStatus, string> = {
  HADIR: "Hadir",
  ALFA: "Alfa",
  SAKIT: "Sakit",
  IZIN: "Izin",
  TERLAMBAT: "Terlambat",
};

interface FormValues {
  studentId?: string;
  extracurricularId?: string;
  date?: string;
  status: AttendanceStatus;
}

export function AttendanceForm({ mode, initialData, extracurriculars = [], students = [] }: AttendanceFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "create" ? createSchema : updateSchema),
    defaultValues: initialData || {
      studentId: "",
      extracurricularId: "",
      date: new Date().toISOString().split("T")[0],
      status: "HADIR",
    },
  });

  function onSubmit(data: FormValues) {
    setError(null);
    startTransition(async () => {
      try {
        let result;
        if (mode === "edit" && initialData) {
          result = await updateAttendance(initialData.id, { status: data.status });
        } else {
          if (!data.studentId || !data.extracurricularId || !data.date) {
            setError("Data tidak lengkap.");
            return;
          }
          result = await createAttendance({
            studentId: data.studentId,
            extracurricularId: data.extracurricularId,
            date: data.date,
            status: data.status,
          });
        }

        if (result.error) {
          setError(result.error);
        } else {
          setOpen(false);
          if (mode === "create") form.reset();
          router.refresh();
        }
      } catch (_err) {
        setError("Terjadi kesalahan sistem.");
        console.error(_err);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={mode === "create" ? (
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shrink-0" />
        ) : (
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-orange-600 hover:bg-orange-50" />
        )}
      >
        {mode === "create" ? (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Catat Absensi
          </>
        ) : (
          <>
            <span className="sr-only">Edit</span>
            <Edit className="h-4 w-4" />
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Catat Absensi Baru" : "Edit Status Absensi"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {mode === "create" && (
              <>
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
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Siswa</FormLabel>
                      <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih siswa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.fullName}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
