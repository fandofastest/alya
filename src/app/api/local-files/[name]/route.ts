import { readFile } from "node:fs/promises";
import path from "node:path";

import { getViewerSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { PkpuModel } from "@/models/Pkpu";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

const uploadDirectory = path.join(process.cwd(), "storage", "uploads");

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safeName = path.basename(name);
  const fileUrl = `/api/local-files/${safeName}`;

  await connectDb();
  const [pkpu, simpleDocument] = await Promise.all([
    PkpuModel.findOne({ fileUrl }).select("visibility").lean(),
    SimpleDocumentModel.findOne({ fileUrl }).select("visibility").lean(),
  ]);

  const owner = pkpu ?? simpleDocument;
  if (!owner) {
    return new Response("Dokumen tidak ditemukan.", { status: 404 });
  }

  if (owner.visibility === "private") {
    const viewer = await getViewerSession();
    if (!viewer) {
      return new Response("Dokumen tidak ditemukan.", { status: 404 });
    }
  }

  try {
    const fileBuffer = await readFile(path.join(uploadDirectory, safeName));
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": owner.visibility === "private" ? "private, no-store" : "public, max-age=3600",
      },
    });
  } catch {
    return new Response("File tidak ditemukan.", { status: 404 });
  }
}
