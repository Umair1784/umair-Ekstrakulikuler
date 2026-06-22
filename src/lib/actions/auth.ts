"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Email atau password tidak valid." };
  }
  
  const { email, password } = parsed.data;

  // Determine user role for redirection
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!user) {
    return { error: "Email atau password tidak valid." };
  }

  let redirectTo = "/";
  if (user.role === "ADMIN") redirectTo = "/admin";
  else if (user.role === "PEMBINA") redirectTo = "/pembina";
  else if (user.role === "SISWA") redirectTo = "/siswa";
  else if (user.role === "ORANG_TUA") redirectTo = "/orang-tua";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (_error) {
    if (_error instanceof AuthError) {
      switch (_error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Terjadi kesalahan saat login." };
      }
    }
    throw _error; // Rethrow Next.js redirect error
  }
}
