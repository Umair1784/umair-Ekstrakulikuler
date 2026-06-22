import { signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-1 justify-end items-center gap-x-4 lg:gap-x-6 w-full">
      <div className="flex items-center gap-x-3">
        <span className="text-sm font-semibold leading-6 text-slate-900">
          {user.name || "User"}
        </span>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          {user.role}
        </Badge>
      </div>
      <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </form>
    </div>
  );
}
