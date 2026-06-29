"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  verifyPassword,
  isAuthConfigured,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured) {
    return { error: "Admin auth is not configured yet. See README.md." };
  }
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }

  const token = await createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
