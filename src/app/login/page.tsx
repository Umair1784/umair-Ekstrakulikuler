import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke EkskulKu untuk mengelola kegiatan ekstrakurikuler sekolah.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl mb-2">
            EkskulKu
          </h1>
          <p className="text-slate-600">
            Sistem Informasi Ekstrakurikuler
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
