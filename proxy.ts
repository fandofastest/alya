import { NextRequest, NextResponse } from "next/server";

import { verifyAdminToken } from "@/lib/auth";

const TOKEN_COOKIE_NAME = "pkpu_admin_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const session = token ? verifyAdminToken(token) : null;

  if (!session && !isAdminLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (session && isAdminLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
