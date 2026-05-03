import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { connectDb } from "@/lib/db";
import { AdminUserModel } from "@/models/AdminUser";

const TOKEN_COOKIE_NAME = "pkpu_admin_token";
const TOKEN_EXPIRES_IN = "8h";

type AdminJwtPayload = {
  sub: string;
  email: string;
  role: "admin";
};

export async function ensureDefaultAdmin() {
  await connectDb();
  const existing = await AdminUserModel.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  return AdminUserModel.create({
    email: env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    nama: "Administrator PKPU",
  });
}

export async function verifyAdminCredentials(email: string, password: string) {
  await connectDb();
  const admin = await AdminUserModel.findOne({ email: email.toLowerCase() });
  if (!admin) return null;
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return null;
  return admin;
}

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}
