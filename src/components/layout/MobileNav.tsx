"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  links: { href: string; label: string }[];
}

export default function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="Open Menu">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="bg-white">
        <SheetHeader>
          <SheetTitle className="text-left text-2xl font-bold text-slate-900">
            Ekskul<span className="text-orange-500">Ku</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-lg font-medium transition-colors hover:text-orange-500 ${
                pathname === link.href ? "text-orange-500" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={buttonVariants({ className: "w-full bg-orange-500 hover:bg-orange-600 text-white" })}
            >
              Login
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
