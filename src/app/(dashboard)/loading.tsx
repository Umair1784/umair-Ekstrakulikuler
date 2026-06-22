import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
        <p className="text-slate-500 text-sm">Memuat data...</p>
      </div>
    </div>
  );
}
