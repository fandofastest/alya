import { SimpleDocumentList } from "@/components/public/SimpleDocumentList";
import { getI18n } from "@/lib/i18n-server";
import { getSimpleDocumentList } from "@/lib/simple-documents";
import type { SimpleDocumentRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BeritaAcaraPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { locale } = await getI18n();
  const searchParams = await props.searchParams;
  const items = await getSimpleDocumentList("berita-acara", searchParams.q);

  return (
    <SimpleDocumentList
      locale={locale}
      type="berita-acara"
      items={items as unknown as SimpleDocumentRecord[]}
      q={searchParams.q}
    />
  );
}
