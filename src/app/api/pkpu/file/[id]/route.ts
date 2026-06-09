import { NextResponse } from "next/server";
import { getViewerSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { PkpuModel } from "@/models/Pkpu";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!env.EXTERNAL_UPLOAD_TOKEN) {
    return new Response("Konfigurasi token eksternal belum lengkap.", { status: 500 });
  }

  await connectDb();
  const [pkpu, simpleDocument] = await Promise.all([
    PkpuModel.findOne({ fileUrl: `/api/pkpu/file/${id}` }).select("visibility").lean(),
    SimpleDocumentModel.findOne({ fileUrl: `/api/pkpu/file/${id}` }).select("visibility").lean(),
  ]);
  const owner = pkpu ?? simpleDocument;
  if (!owner) {
    return new Response("Dokumen tidak ditemukan.", { status: 404 });
  }

  const isPrivate = owner.visibility === "private";
  if (isPrivate) {
    const viewer = await getViewerSession();
    if (!viewer) {
      return new Response("PKPU tidak ditemukan.", { status: 404 });
    }
  }

  // URL dasar server kpu fando
  const externalBaseUrl = "https://serverkpu.fando.id/api/integrations/files";
  const fileUrl = `${externalBaseUrl}/${id}`;

  try {
    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "x-integration-token": env.EXTERNAL_UPLOAD_TOKEN,
      },
    });

    if (!response.ok) {
      console.error(`Gagal mengambil file: ${response.status} ${response.statusText}`);
      return new Response("Gagal mengambil file dari server eksternal.", {
        status: response.status,
      });
    }

    // Ambil data stream dan paksa header agar bisa di-preview (inline)
    const contentType = response.headers.get("content-type") || "application/pdf";

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": isPrivate ? "private, no-store" : "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error proxying file:", error);
    return new Response("Terjadi kesalahan internal saat mengambil file.", { status: 500 });
  }
}
