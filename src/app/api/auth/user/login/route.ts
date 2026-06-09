import { NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { setUserAuthCookie, signUserToken, verifyUserCredentials } from "@/lib/auth";
import { userLoginSchema } from "@/validators/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = userLoginSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError("Data login tidak valid.", 400);
  }

  const { nip, password } = parseResult.data;
  const user = await verifyUserCredentials(nip, password);
  if (!user) {
    return jsonError("NIP atau password salah.", 401);
  }

  const token = signUserToken({
    sub: user._id.toString(),
    nip: user.nip,
    role: "user",
  });

  const response = NextResponse.json({
    message: "Login berhasil.",
    user: { id: user._id, nip: user.nip, nama: user.nama },
  });
  setUserAuthCookie(response, token);
  return response;
}
