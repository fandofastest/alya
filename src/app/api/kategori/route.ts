import { NextResponse } from "next/server";
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
    const { nama, deskripsi } = body;

    if (!nama) return jsonError("Nama kategori wajib diisi.", 400);

    await connectDb();
    const slug = slugify(nama, { lower: true, strict: true });

    const existing = await KategoriModel.findOne({ slug });
    if (existing) return jsonError("Kategori dengan nama serupa sudah ada.", 400);

    const newKategori = await KategoriModel.create({
      nama,
      slug,
      deskripsi: deskripsi || "",
    });

    return NextResponse.json(
      { message: "Kategori berhasil dibuat.", data: newKategori },
      { status: 201 }
    );
  } catch (err) {
    return jsonError("Gagal membuat kategori.", 500);
  }
}
