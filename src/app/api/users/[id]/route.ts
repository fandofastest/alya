import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return jsonError("User tidak valid.", 400);

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Data tidak valid.", 400);

  const nip = "nip" in body ? String((body as { nip?: unknown }).nip ?? "") : "";
  const nama = "nama" in body ? String((body as { nama?: unknown }).nama ?? "") : "";
  const password = "password" in body ? String((body as { password?: unknown }).password ?? "") : "";
  const isActiveRaw = "isActive" in body ? (body as { isActive?: unknown }).isActive : undefined;
  const isActive = typeof isActiveRaw === "boolean" ? isActiveRaw : undefined;

  if (!nip.trim()) return jsonError("NIP wajib diisi.", 400);
  if (!nama.trim()) return jsonError("Nama wajib diisi.", 400);
  if (password && password.length < 6) return jsonError("Password minimal 6 karakter.", 400);

  await connectDb();

  const existing = await UserModel.findById(id);
  if (!existing) return jsonError("User tidak ditemukan.", 404);

  const other = await UserModel.findOne({ nip: nip.trim(), _id: { $ne: id } }).select("_id").lean();
  if (other) return jsonError("NIP sudah dipakai user lain.", 400);

  existing.set({
    nip: nip.trim(),
    nama: nama.trim(),
    ...(isActive === undefined ? {} : { isActive }),
  });

  if (password) {
    existing.set({ passwordHash: await bcrypt.hash(password, 10) });
  }

  await existing.save();
  return NextResponse.json({ message: "User berhasil diperbarui.", data: { id: existing._id, nip: existing.nip, nama: existing.nama, isActive: existing.isActive } });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return jsonError("User tidak valid.", 400);

  await connectDb();
  const deleted = await UserModel.findByIdAndDelete(id).lean();
  if (!deleted) return jsonError("User tidak ditemukan.", 404);
  return NextResponse.json({ message: "User berhasil dihapus." });
}
