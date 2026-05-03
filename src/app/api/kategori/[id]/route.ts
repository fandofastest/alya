import { NextResponse } from "next/server";
import slugify from "slugify";

import { jsonError, requireAdmin } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = await request.json();
    const { nama, deskripsi } = body;

    if (!nama) return jsonError("Nama kategori wajib diisi.", 400);

    await connectDb();
    const slug = slugify(nama, { lower: true, strict: true });

    const existing = await KategoriModel.findOne({ slug, _id: { $ne: id } });
    if (existing) return jsonError("Kategori dengan nama serupa sudah ada.", 400);

    const updated = await KategoriModel.findByIdAndUpdate(
      id,
      { nama, slug, deskripsi: deskripsi || "" },
      { new: true }
    );

    if (!updated) return jsonError("Kategori tidak ditemukan.", 404);

    return NextResponse.json({ message: "Kategori berhasil diperbarui.", data: updated });
  } catch (err) {
    return jsonError("Gagal memperbarui kategori.", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    await connectDb();

    // Check if kategori is used in any PKPU
    const isUsed = await PkpuModel.exists({ kategori: id });
    if (isUsed) {
      return jsonError("Kategori tidak dapat dihapus karena masih digunakan oleh data PKPU.", 400);
    }

    const deleted = await KategoriModel.findByIdAndDelete(id);
    if (!deleted) return jsonError("Kategori tidak ditemukan.", 404);

    return NextResponse.json({ message: "Kategori berhasil dihapus." });
  } catch (err) {
    return jsonError("Gagal menghapus kategori.", 500);
  }
}
