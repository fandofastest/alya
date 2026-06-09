import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { jsonError, requireAdmin } from "@/lib/api";
import { getViewerSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { generateDocumentSlug } from "@/lib/utils";
import { SimpleDocumentModel } from "@/models/SimpleDocument";
import { simpleDocumentSchema } from "@/validators/simple-document";

async function getDocumentByIdOrSlug(id: string) {
  if (Types.ObjectId.isValid(id)) {
    const doc = await SimpleDocumentModel.findById(id).lean();
    if (doc) return doc;
  }
  return SimpleDocumentModel.findOne({ slug: id }).lean();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const viewer = await getViewerSession();
  const { id } = await params;
  const doc = await getDocumentByIdOrSlug(id);
  if (!doc) return jsonError("Dokumen tidak ditemukan.", 404);
  if (doc.visibility === "private" && !viewer) return jsonError("Dokumen tidak ditemukan.", 404);
  return NextResponse.json({ data: doc });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const { id } = await params;
  const existing = await SimpleDocumentModel.findById(id);
  if (!existing) return jsonError("Dokumen tidak ditemukan.", 404);

  const body = await request.json();
  const parseResult = simpleDocumentSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError(parseResult.error.issues[0]?.message ?? "Data tidak valid.", 400);
  }

  const payload = parseResult.data;
  existing.set({
    ...payload,
    slug: generateDocumentSlug(payload.judul, payload.nomor),
  });
  await existing.save();
  return NextResponse.json({ message: "Dokumen berhasil diperbarui.", data: existing });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await connectDb();
  const { id } = await params;
  const target = await SimpleDocumentModel.findById(id);
  if (!target) return jsonError("Dokumen tidak ditemukan.", 404);
  await target.deleteOne();
  return NextResponse.json({ message: "Dokumen berhasil dihapus." });
}
