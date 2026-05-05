import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { generatePkpuSlug } from "@/lib/utils";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";
import { updatePkpuSchema } from "@/validators/pkpu";

async function getPkpuByIdOrSlug(id: string) {
  if (Types.ObjectId.isValid(id)) {
    const doc = await PkpuModel.findById(id).populate("kategori").populate("parentId").lean();
    if (doc) return doc;
  }
  return PkpuModel.findOne({ slug: id }).populate("kategori").populate("parentId").lean();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const doc = await getPkpuByIdOrSlug(id);
  if (!doc) return jsonError("PKPU tidak ditemukan.", 404);
  return NextResponse.json({ data: doc });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const { id } = await params;
  const existing = await PkpuModel.findById(id);
  if (!existing) return jsonError("PKPU tidak ditemukan.", 404);

  const body = await request.json();
  const parseResult = updatePkpuSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError(parseResult.error.issues[0]?.message ?? "Data tidak valid.", 400);
  }

  const payload = parseResult.data;
  payload.parentId = payload.statusHukum === "berlaku" ? null : payload.parentId;

  if (!(await KategoriModel.exists({ _id: payload.kategori }))) {
    return jsonError("Kategori tidak ditemukan.", 404);
  }

  if (payload.statusHukum === "revisi" || payload.statusHukum === "dicabut") {
    if (!payload.parentId || !Types.ObjectId.isValid(payload.parentId)) {
      return jsonError("Parent PKPU tidak valid.", 400);
    }
    const parent = await PkpuModel.findOne({ _id: payload.parentId, statusHukum: { $in: ["berlaku", "induk"] } });
    if (!parent) return jsonError("Parent PKPU berlaku tidak ditemukan.", 404);
  }

  existing.set({
    ...payload,
    slug: generatePkpuSlug(payload.judul, payload.nomor, payload.tahun),
  });
  await existing.save();

  return NextResponse.json({ message: "PKPU berhasil diperbarui.", data: existing });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const { id } = await params;
  const target = await PkpuModel.findById(id);
  if (!target) return jsonError("PKPU tidak ditemukan.", 404);

  if (target.statusHukum === "berlaku" || target.statusHukum === "induk") {
    const childrenCount = await PkpuModel.countDocuments({ parentId: target._id });
    if (childrenCount > 0) {
      return jsonError("PKPU berlaku tidak dapat dihapus karena memiliki relasi revisi/pencabutan.", 400);
    }
  }

  await target.deleteOne();
  return NextResponse.json({ message: "PKPU berhasil dihapus." });
}
