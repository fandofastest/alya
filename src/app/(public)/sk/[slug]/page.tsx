import { notFound, redirect } from "next/navigation";

import { SimpleDocumentDetail } from "@/components/public/SimpleDocumentDetail";
import { getUserSession } from "@/lib/auth";
import { getI18n } from "@/lib/i18n-server";
import type { SimpleDocumentRecord } from "@/lib/types";
import { connectDb } from "@/lib/db";
import { getSimpleDocumentBySlug } from "@/lib/simple-documents";
import { SimpleDocumentModel } from "@/models/SimpleDocument";

export const dynamic = "force-dynamic";

export default async function SkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const session = await getUserSession();
  if (!session) {
    redirect(`/login?next=/sk/${slug}`);
  }

  const { locale } = await getI18n();
  const item = await getSimpleDocumentBySlug("sk", slug);
  if (!item) return notFound();

  await connectDb();
  await SimpleDocumentModel.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

  return <SimpleDocumentDetail locale={locale} type="sk" item={item as unknown as SimpleDocumentRecord} />;
}
