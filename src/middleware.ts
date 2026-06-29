import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  verifySessionToken,
  isAuthConfigured,
} from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");

  // Auth not configured yet → the login page explains how to set it up.
  if (!isAuthConfigured) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (isLogin && valid) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (!isLogin && !valid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
