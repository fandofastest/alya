import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { connectDb } from "@/lib/db";
import { AdminUserModel } from "@/models/AdminUser";
import { UserModel } from "@/models/User";

const ADMIN_TOKEN_COOKIE_NAME = "pkpu_admin_token";
const ADMIN_TOKEN_EXPIRES_IN = "8h";
const USER_TOKEN_COOKIE_NAME = "pkpu_user_token";
const USER_TOKEN_EXPIRES_IN = "7d";

type AdminJwtPayload = {
  sub: string;
  email: string;
  role: "admin";
};

type UserJwtPayload = {
  sub: string;
  nip: string;
  role: "user";
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
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: ADMIN_TOKEN_EXPIRES_IN });
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
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/",
  });
}

export function clearAdminAuthCookie(response: NextResponse) {
  response.cookies.set(ADMIN_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}

export async function verifyUserCredentials(nip: string, password: string) {
  await connectDb();
  const user = await UserModel.findOne({ nip: nip.trim(), isActive: true });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  return user;
}

export function signUserToken(payload: UserJwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: USER_TOKEN_EXPIRES_IN });
}

export function verifyUserToken(token: string): UserJwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function getPublicSession() {
  return getUserSession();
}

export async function getViewerSession() {
  return (await getAdminSession()) ?? (await getUserSession());
}

export function setUserAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(USER_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export function clearUserAuthCookie(response: NextResponse) {
  response.cookies.set(USER_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}
