import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Trophy,
  Megaphone,
  FileBarChart,
  Activity,
  BookOpen,
} from "lucide-react";
import { Role } from "@prisma/client";

export function getNavigationByRole(role: Role | string) {
  const basePath = `/${role.toLowerCase().replace("_", "-")}`;

  switch (role) {
    case "ADMIN":
      return [
        { name: "Dashboard", href: `${basePath}`, icon: LayoutDashboard },
        { name: "Extracurricular", href: `${basePath}/extracurricular`, icon: BookOpen },
        { name: "Members", href: `${basePath}/members`, icon: Users },
        { name: "Attendance", href: `${basePath}/attendance`, icon: CalendarCheck },
        { name: "Achievements", href: `${basePath}/achievements`, icon: Trophy },
        { name: "Announcements", href: `${basePath}/announcements`, icon: Megaphone },
        { name: "Reports", href: `${basePath}/reports`, icon: FileBarChart },
      ];
    case "PEMBINA":
      return [
        { name: "Dashboard", href: `${basePath}`, icon: LayoutDashboard },
        { name: "My Extracurricular", href: `${basePath}/extracurricular`, icon: BookOpen },
        { name: "Attendance", href: `${basePath}/attendance`, icon: CalendarCheck },
        { name: "Achievements", href: `${basePath}/achievements`, icon: Trophy },
      ];
    case "SISWA":
      return [
        { name: "Dashboard", href: `${basePath}`, icon: LayoutDashboard },
        { name: "My Activities", href: `${basePath}/activities`, icon: Activity },
        { name: "Attendance History", href: `${basePath}/attendance`, icon: CalendarCheck },
        { name: "Achievements", href: `${basePath}/achievements`, icon: Trophy },
      ];
    case "ORANG_TUA":
      return [
        { name: "Dashboard", href: `${basePath}`, icon: LayoutDashboard },
        { name: "Child Activities", href: `${basePath}/activities`, icon: Activity },
        { name: "Attendance", href: `${basePath}/attendance`, icon: CalendarCheck },
        { name: "Achievements", href: `${basePath}/achievements`, icon: Trophy },
      ];
    default:
      return [];
  }
}
