import { NextResponse } from "next/server";

import { jsonError, requireAdmin } from "@/lib/api";
import { storePdfFile } from "@/lib/storage";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("File tidak ditemukan.", 400);

  if (file.type !== "application/pdf") {
    return jsonError("Hanya file PDF yang diperbolehkan.", 400);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return jsonError("Ukuran file maksimal 10MB.", 400);
  }

  const fileUrl = await storePdfFile(file, {
    nomor: formData.get("nomor"),
    tahun: formData.get("tahun"),
    judul: formData.get("judul"),
    tanggalPenetapan: formData.get("tanggalPenetapan"),
  });
  return NextResponse.json({ message: "Upload berhasil.", fileUrl }, { status: 201 });
}
