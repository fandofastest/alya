import { NextResponse } from "next/server";

import {
  ensureDefaultAdmin,
  setAuthCookie,
  signAdminToken,
  verifyAdminCredentials,
} from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { loginSchema } from "@/validators/auth";

export async function POST(request: Request) {
  await ensureDefaultAdmin();

  const body = await request.json();
  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError("Data login tidak valid.", 400);
  }

  const { email, password } = parseResult.data;
  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return jsonError("Email atau password salah.", 401);
  }

  const token = signAdminToken({
    sub: admin._id.toString(),
    email: admin.email,
    role: "admin",
  });

  const response = NextResponse.json({
    message: "Login berhasil.",
    admin: { id: admin._id, email: admin.email, nama: admin.nama },
  });
  setAuthCookie(response, token);
  return response;
}
