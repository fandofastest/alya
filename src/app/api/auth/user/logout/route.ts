import { NextResponse } from "next/server";

import { clearUserAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil." });
  clearUserAuthCookie(response);
  return response;
}
