import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!env.EXTERNAL_UPLOAD_TOKEN) {
    return new Response("Konfigurasi token eksternal belum lengkap.", { status: 500 });
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
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error proxying file:", error);
    return new Response("Terjadi kesalahan internal saat mengambil file.", { status: 500 });
  }
}
