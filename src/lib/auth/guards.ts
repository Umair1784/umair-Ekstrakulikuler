import { auth } from "@/auth";
import { Role } from "@prisma/client";

/**
 * Returns the current authenticated user or null.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Requires an authenticated user. Throws an error if not authenticated.
 * Returns the user object.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  return user;
}

/**
 * Requires the user to have a specific role. Throws an error if unauthorized.
 * Returns the user object.
 */
export async function requireRole(role: Role) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`Forbidden: This action requires the ${role} role.`);
  }
  return user;
}

/**
 * Returns a boolean indicating if the current user has the specified role.
 */
export async function hasRole(role: Role) {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Returns a boolean indicating if the current user is an Admin.
 */
export async function isAdmin() {
  return hasRole(Role.ADMIN);
}

/**
 * Returns a boolean indicating if the current user is a Pembina.
 */
export async function isPembina() {
  return hasRole(Role.PEMBINA);
}

/**
 * Returns a boolean indicating if the current user is a Siswa.
 */
export async function isSiswa() {
  return hasRole(Role.SISWA);
}

/**
 * Returns a boolean indicating if the current user is an Orang Tua.
 */
export async function isOrangTua() {
  return hasRole(Role.ORANG_TUA);
}

/**
 * Returns a boolean indicating if the current user is either an Admin or a Pembina.
 */
export async function isAdminOrPembina() {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN || user?.role === Role.PEMBINA;
}
