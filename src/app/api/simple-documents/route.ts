import { NextResponse } from "next/server";

import { jsonError, requireAdmin } from "@/lib/api";
import { getViewerSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { generateDocumentSlug } from "@/lib/utils";
import { SimpleDocumentModel } from "@/models/SimpleDocument";
import { simpleDocumentSchema } from "@/validators/simple-document";

export async function GET(request: Request) {
  await connectDb();
  const viewer = await getViewerSession();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const skip = (page - 1) * limit;
  const type = searchParams.get("type");
  const query = searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = {};
  if (type === "sk" || type === "berita-acara") filter.type = type;
  if (query) filter.$text = { $search: query };
  if (!viewer) {
    filter.visibility = { $ne: "private" };
  }

  const [data, total] = await Promise.all([
    SimpleDocumentModel.find(filter)
      .sort(query ? { score: { $meta: "textScore" } } : { tahun: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SimpleDocumentModel.countDocuments(filter),
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
  const parseResult = simpleDocumentSchema.safeParse(body);
  if (!parseResult.success) {
    return jsonError(parseResult.error.issues[0]?.message ?? "Data tidak valid.", 400);
  }

  const payload = parseResult.data;
  const slug = generateDocumentSlug(payload.judul, payload.nomor);
  const created = await SimpleDocumentModel.create({ ...payload, slug });
  return NextResponse.json({ message: "Dokumen berhasil ditambahkan.", data: created }, { status: 201 });
}
