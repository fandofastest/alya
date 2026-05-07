import { NextResponse } from "next/server";
import { incrementPkpuDownload } from "@/lib/repositories";
import { PkpuModel } from "@/models/Pkpu";
import { connectDb } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  
  const pkpu = await PkpuModel.findById(id).select("fileUrl").lean();
  if (!pkpu) {
    return NextResponse.json({ error: "PKPU tidak ditemukan." }, { status: 404 });
  }

  // Increment download count in background (or await if you want to be sure)
  await incrementPkpuDownload(id);

  // Redirect to the actual file URL
  return NextResponse.redirect(pkpu.fileUrl);
}
