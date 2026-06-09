import { NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { setUserAuthCookie, signUserToken, verifyUserCredentials } from "@/lib/auth";
import { loginSchema } from "@/validators/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError("Data login tidak valid.", 400);
  }

  const { email, password } = parseResult.data;
  const user = await verifyUserCredentials(email, password);
  if (!user) {
    return jsonError("Email atau password salah.", 401);
  }

  const token = signUserToken({
    sub: user._id.toString(),
    email: user.email,
    role: "user",
  });

  const response = NextResponse.json({
    message: "Login berhasil.",
    user: { id: user._id, email: user.email, nama: user.nama },
  });
  setUserAuthCookie(response, token);
  return response;
}
