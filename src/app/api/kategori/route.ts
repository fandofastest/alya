import { NextResponse } from "next/server";
import { Types } from "mongoose";
import slugify from "slugify";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";

export async function GET() {
  await connectDb();
  const kategori = await KategoriModel.find().sort({ nama: 1 }).lean();
  return NextResponse.json({ data: kategori });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { nama, deskripsi, parentId } = body;

    if (!nama) return jsonError("Nama kategori wajib diisi.", 400);

    await connectDb();
    const slug = slugify(nama, { lower: true, strict: true });

    const existing = await KategoriModel.findOne({ slug });
    if (existing) return jsonError("Kategori dengan nama serupa sudah ada.", 400);

    let parentObjectId: Types.ObjectId | null = null;
    if (parentId !== null && parentId !== undefined && String(parentId).trim() !== "") {
      if (!Types.ObjectId.isValid(parentId)) return jsonError("Parent kategori tidak valid.", 400);
      const parent = await KategoriModel.findById(parentId).select("_id").lean();
      if (!parent) return jsonError("Parent kategori tidak ditemukan.", 404);
      parentObjectId = new Types.ObjectId(parentId);
    }

    const newKategori = await KategoriModel.create({
      nama,
      slug,
      deskripsi: deskripsi || "",
      parentId: parentObjectId,
    });

    return NextResponse.json(
      { message: "Kategori berhasil dibuat.", data: newKategori },
      { status: 201 }
    );
  } catch (err) {
    return jsonError("Gagal membuat kategori.", 500);
  }
}
