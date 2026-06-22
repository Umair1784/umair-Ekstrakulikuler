"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Dynamically import PDFDownloadLink to prevent SSR hydration mismatch and node-specific issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

import { AttendancePdfDocument } from "@/lib/reports/generateAttendancePdf";
import { ExtracurricularPdfDocument } from "@/lib/reports/generateExtracurricularPdf";

export function ExportPdfButton({ type, data }: { type: "attendance" | "extracurricular", data: Record<string, unknown>[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" className="w-full sm:w-auto" disabled>
        <Download className="mr-2 h-4 w-4" />
        Memuat...
      </Button>
    );
  }

  const document = type === "attendance" 
    ? <AttendancePdfDocument data={data as never[]} /> 
    : <ExtracurricularPdfDocument data={data as never[]} />;
    
  const fileName = type === "attendance" 
    ? "Laporan_Kehadiran.pdf" 
    : "Laporan_Ekstrakurikuler.pdf";
    
  const label = type === "attendance" 
    ? "Export Attendance PDF" 
    : "Export Extracurricular PDF";

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <PDFDownloadLink document={document as any} fileName={fileName} className="w-full sm:w-auto">
      {({ loading }) => (
        <Button variant="outline" className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50" disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? "Menyiapkan PDF..." : label}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
