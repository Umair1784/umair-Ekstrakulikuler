import { Loader2 } from "lucide-react";

export default function PublicLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
        <p className="text-slate-500 text-sm">Memuat halaman...</p>
      </div>
    </div>
  );
}
