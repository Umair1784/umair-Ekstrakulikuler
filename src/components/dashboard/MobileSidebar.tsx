"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getNavigationByRole } from "./navigation";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  role: string;
}

export function MobileSidebar({ role }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const navigation = getNavigationByRole(role);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:text-slate-700" />
        }
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-xl font-bold text-slate-900">EkskulKu</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center px-3 py-2 text-base font-medium rounded-md text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                )}
              >
                <item.icon
                  className="mr-4 h-6 w-6 flex-shrink-0 text-slate-400 group-hover:text-orange-600"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
