"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { generateAttendanceExcelBase64 } from "@/lib/reports/generateAttendanceExcel";
import { generateExtracurricularExcelBase64 } from "@/lib/reports/generateExtracurricularExcel";

export function ExportExcelButton({ type }: { type: "attendance" | "extracurricular" }) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      try {
        let base64 = "";
        let fileName = "";
        if (type === "attendance") {
          const filters = {
            ekskul: searchParams.get("ekskul") || undefined,
            startDate: searchParams.get("startDate") || undefined,
            endDate: searchParams.get("endDate") || undefined,
          };
          base64 = await generateAttendanceExcelBase64(filters);
          fileName = "Laporan_Kehadiran.xlsx";
        } else {
          base64 = await generateExtracurricularExcelBase64();
          fileName = "Laporan_Ekstrakurikuler.xlsx";
        }

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } catch (_error) {
        alert("Gagal mengekspor data.");
      }
    });
  };

  const label = type === "attendance" ? "Export Attendance Excel" : "Export Extracurricular Excel";

  return (
    <Button 
      variant="outline" 
      className="w-full sm:w-auto border-green-200 text-green-700 hover:bg-green-50" 
      onClick={handleExport}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
      {isPending ? "Menyiapkan Excel..." : label}
    </Button>
  );
}
