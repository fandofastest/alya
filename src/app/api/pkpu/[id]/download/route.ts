import { NextResponse } from "next/server";
import { incrementPkpuDownload } from "@/lib/repositories";
import { PkpuModel } from "@/models/Pkpu";
import { connectDb } from "@/lib/db";
import { getViewerSession } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  
  const pkpu = await PkpuModel.findById(id).select("fileUrl visibility").lean();
  if (!pkpu) {
    return NextResponse.json({ error: "PKPU tidak ditemukan." }, { status: 404 });
  }

  if ((pkpu as { visibility?: string }).visibility === "private") {
    const viewer = await getViewerSession();
    if (!viewer) {
      return NextResponse.json({ error: "PKPU tidak ditemukan." }, { status: 404 });
    }
  }

  // Increment download count
  await incrementPkpuDownload(id);

  // Ensure absolute URL for redirect
  const redirectUrl = pkpu.fileUrl.startsWith("http")
    ? pkpu.fileUrl
    : new URL(pkpu.fileUrl, _request.url).toString();

  return NextResponse.redirect(redirectUrl);
}
