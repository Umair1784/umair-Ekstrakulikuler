"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ReportFilters({ extracurriculars }: { extracurriculars: { id: string, name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ekskul, setEkskul] = useState(searchParams.get("ekskul") || "all");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (ekskul && ekskul !== "all") params.set("ekskul", ekskul);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/admin/reports?${params.toString()}`);
  };

  const handleReset = () => {
    setEkskul("all");
    setStartDate("");
    setEndDate("");
    router.push(`/admin/reports`);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-semibold text-slate-900">Filter Laporan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Ekstrakurikuler</Label>
          <Select value={ekskul} onValueChange={(val) => setEkskul(val || "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Ekstrakurikuler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Ekstrakurikuler</SelectItem>
              {extracurriculars.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tanggal Mulai</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Tanggal Akhir</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleFilter}>Terapkan Filter</Button>
      </div>
    </div>
  );
}
