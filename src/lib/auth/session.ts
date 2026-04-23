import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/features/auth/mock-auth-service";
import type { AuthRole, MockUser } from "@/features/auth/types";

const SESSION_COOKIE = "kp-auth-session";

export async function getCurrentUser(): Promise<MockUser | null> {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionUserId) {
    return null;
  }

  return getUserById(sessionUserId);
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: AuthRole | AuthRole[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    redirect(user.role === "contractor" ? "/dashboard" : "/admin");
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  redirect(user.role === "contractor" ? "/dashboard" : "/admin");
}
