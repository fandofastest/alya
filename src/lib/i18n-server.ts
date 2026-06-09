import { cookies } from "next/headers";

import { getDictionary, LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export async function getLocale() {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
