import { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ExtracurricularSection from "@/components/home/ExtracurricularSection";
import AchievementSection from "@/components/home/AchievementSection";
import AnnouncementSection from "@/components/home/AnnouncementSection";
import ContactSection from "@/components/home/ContactSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EkskulKu | Sistem Informasi Ekstrakurikuler",
  description: "EkskulKu adalah platform manajemen ekstrakurikuler sekolah yang memudahkan pendaftaran, absensi, jadwal, dan pencatatan prestasi siswa. Hubungi kami untuk informasi lebih lanjut.",
  keywords: "ekstrakurikuler, sekolah, absensi, manajemen ekskul, jadwal kegiatan, prestasi siswa",
  openGraph: {
    title: "EkskulKu | Sistem Informasi Ekstrakurikuler",
    description: "Platform manajemen ekstrakurikuler sekolah untuk kelola kegiatan, absensi, dan prestasi dengan mudah.",
    type: "website",
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ExtracurricularSection />
      <AchievementSection />
      <AnnouncementSection />
      <ContactSection />
    </div>
  );
}
