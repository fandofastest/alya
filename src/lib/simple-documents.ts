import { getPublicSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export type SimpleDocumentListType = "sk" | "berita-acara";

export async function getSimpleDocumentList(type: SimpleDocumentListType, q?: string) {
  await connectDb();
  const viewer = await getPublicSession();
  const filter: Record<string, unknown> = { type, isActive: true };
  if (!viewer) filter.visibility = { $ne: "private" };
  if (q?.trim()) filter.$text = { $search: q.trim() };

  return SimpleDocumentModel.find(filter)
    .sort(q?.trim() ? { score: { $meta: "textScore" } } : { tahun: -1, createdAt: -1 })
    .limit(100)
    .lean();
}

export async function getSimpleDocumentBySlug(type: SimpleDocumentListType, slug: string) {
  await connectDb();
  const viewer = await getPublicSession();
  return SimpleDocumentModel.findOne({
    type,
    slug,
    isActive: true,
    ...(viewer ? {} : { visibility: { $ne: "private" } }),
  }).lean();
}

export async function getLatestSimpleDocuments(type: SimpleDocumentListType, limit = 4) {
  await connectDb();
  const viewer = await getPublicSession();
  return SimpleDocumentModel.find({
    type,
    isActive: true,
    ...(viewer ? {} : { visibility: { $ne: "private" } }),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
