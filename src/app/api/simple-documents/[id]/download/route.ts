import { NextResponse } from "next/server";

import { getViewerSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;

  const doc = await SimpleDocumentModel.findById(id).select("fileUrl visibility downloadCount").lean();
  if (!doc) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  }

  if (doc.visibility === "private") {
    const viewer = await getViewerSession();
    if (!viewer) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
    }
  }

  await SimpleDocumentModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
  const redirectUrl = doc.fileUrl.startsWith("http") ? doc.fileUrl : new URL(doc.fileUrl, request.url).toString();
  return NextResponse.redirect(redirectUrl);
}
