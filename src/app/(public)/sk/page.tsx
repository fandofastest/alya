import { redirect } from "next/navigation";

import { SimpleDocumentList } from "@/components/public/SimpleDocumentList";
import { getUserSession } from "@/lib/auth";
import { getI18n } from "@/lib/i18n-server";
import { getSimpleDocumentList } from "@/lib/simple-documents";
import type { SimpleDocumentRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SkPage(props: { searchParams: Promise<{ q?: string }> }) {
  const session = await getUserSession();
  if (!session) {
    redirect("/login?next=/sk");
  }

  const { locale } = await getI18n();
  const searchParams = await props.searchParams;
  const items = await getSimpleDocumentList("sk", searchParams.q);

  return <SimpleDocumentList locale={locale} type="sk" items={items as unknown as SimpleDocumentRecord[]} q={searchParams.q} />;
}
