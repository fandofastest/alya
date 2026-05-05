import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { buildPkpuFilters } from "@/lib/pkpu-query";
import { generatePkpuSlug } from "@/lib/utils";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";
import { createPkpuSchema } from "@/validators/pkpu";

export async function GET(request: Request) {
  await connectDb();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const skip = Math.max(0, page - 1) * limit;

  const { filter, query } = buildPkpuFilters(searchParams);

  const [data, total] = await Promise.all([
    PkpuModel.find(filter)
      .populate("kategori")
      .populate("parentId", "nomor tahun slug judul")
      .sort(query ? { score: { $meta: "textScore" } } : { tahun: -1, nomor: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PkpuModel.countDocuments(filter),
  ]);

  return NextResponse.json({
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const body = await request.json();
  const parseResult = createPkpuSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError(parseResult.error.issues[0]?.message ?? "Data tidak valid.", 400);
  }

  const payload = parseResult.data;
  const slug = generatePkpuSlug(payload.judul, payload.nomor, payload.tahun);

  const kategoriExists = await KategoriModel.exists({ _id: payload.kategori });
  if (!kategoriExists) {
    return jsonError("Kategori tidak ditemukan.", 404);
  }

  if (payload.statusHukum === "revisi" || payload.statusHukum === "dicabut") {
    if (!payload.parentId || !Types.ObjectId.isValid(payload.parentId)) {
      return jsonError("Parent PKPU tidak valid.", 400);
    }
    const parentExists = await PkpuModel.exists({
      _id: payload.parentId,
      statusHukum: { $in: ["berlaku", "induk"] },
    });
    if (!parentExists) {
      return jsonError("Parent PKPU berlaku tidak ditemukan.", 404);
    }
  }

  if (payload.statusHukum === "berlaku") {
    payload.parentId = null;
  }

  const created = await PkpuModel.create({ ...payload, slug });
  return NextResponse.json({ message: "PKPU berhasil ditambahkan.", data: created }, { status: 201 });
}
