import Link from "next/link";
import { getNavigationByRole } from "./navigation";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  role: string;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const navigation = getNavigationByRole(role);

  return (
    <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-slate-200">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">EkskulKu</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              )}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-orange-600"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
