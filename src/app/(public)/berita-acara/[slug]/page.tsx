import { notFound } from "next/navigation";

import { SimpleDocumentDetail } from "@/components/public/SimpleDocumentDetail";
import { getI18n } from "@/lib/i18n-server";
import type { SimpleDocumentRecord } from "@/lib/types";
import { connectDb } from "@/lib/db";
import { getSimpleDocumentBySlug } from "@/lib/simple-documents";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export const dynamic = "force-dynamic";

export default async function BeritaAcaraDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { locale } = await getI18n();
  const { slug } = await props.params;
  const item = await getSimpleDocumentBySlug("berita-acara", slug);
  if (!item) return notFound();

  await connectDb();
  await SimpleDocumentModel.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

  return (
    <SimpleDocumentDetail
      locale={locale}
      type="berita-acara"
      item={item as unknown as SimpleDocumentRecord}
    />
  );
}
