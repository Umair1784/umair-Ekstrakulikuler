"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import MobileNav from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tentang", label: "Tentang" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/prestasi", label: "Prestasi" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              Ekskul<span className="text-orange-500">Ku</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                pathname === link.href ? "text-orange-500" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Link
              href="/login"
              className={buttonVariants({ className: "bg-orange-500 hover:bg-orange-600 text-white" })}
            >
              Login
            </Link>
          </div>
          <div className="md:hidden">
            <MobileNav links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
