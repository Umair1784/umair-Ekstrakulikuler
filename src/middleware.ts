import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isProtectedPath = (path: string) => nextUrl.pathname.startsWith(path);

  const needsAuth =
    isProtectedPath("/admin") ||
    isProtectedPath("/pembina") ||
    isProtectedPath("/siswa") ||
    isProtectedPath("/orang-tua") ||
    isProtectedPath("/dashboard");

  if (needsAuth && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && user) {
    if (isProtectedPath("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
    if (isProtectedPath("/pembina") && user.role !== "PEMBINA") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
    if (isProtectedPath("/siswa") && user.role !== "SISWA") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
    if (isProtectedPath("/orang-tua") && user.role !== "ORANG_TUA") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
