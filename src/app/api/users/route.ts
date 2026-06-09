import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const users = await UserModel.find().sort({ createdAt: -1 }).select("_id nip nama isActive createdAt").lean();
  return NextResponse.json({ data: users });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Data tidak valid.", 400);

  const nip = "nip" in body ? String((body as { nip?: unknown }).nip ?? "") : "";
  const nama = "nama" in body ? String((body as { nama?: unknown }).nama ?? "") : "";
  const password = "password" in body ? String((body as { password?: unknown }).password ?? "") : "";
  const isActiveRaw = "isActive" in body ? (body as { isActive?: unknown }).isActive : true;
  const isActive = typeof isActiveRaw === "boolean" ? isActiveRaw : true;

  if (!nip.trim()) return jsonError("NIP wajib diisi.", 400);
  if (!nama.trim()) return jsonError("Nama wajib diisi.", 400);
  if (password.length < 6) return jsonError("Password minimal 6 karakter.", 400);

  await connectDb();

  const exists = await UserModel.findOne({ nip: nip.trim() }).select("_id").lean();
  if (exists) return jsonError("NIP sudah terdaftar.", 400);

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await UserModel.create({
    nip: nip.trim(),
    nama: nama.trim(),
    passwordHash,
    isActive,
  });

  return NextResponse.json(
    { message: "User berhasil dibuat.", data: { id: created._id, nip: created.nip, nama: created.nama, isActive: created.isActive } },
    { status: 201 }
  );
}
