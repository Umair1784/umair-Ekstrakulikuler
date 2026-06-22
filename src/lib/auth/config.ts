import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
          include: {
            admin: true,
            coach: true,
            student: true,
            parent: true,
          },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        let name = "User";
        if (user.role === Role.ADMIN && user.admin) {
          name = user.admin.fullName;
        } else if (user.role === Role.PEMBINA && user.coach) {
          name = user.coach.fullName;
        } else if (user.role === Role.SISWA && user.student) {
          name = user.student.fullName;
        } else if (user.role === Role.ORANG_TUA && user.parent) {
          name = user.parent.fullName;
        }

        return {
          id: user.id,
          email: user.email,
          name: name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
