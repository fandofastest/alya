import { UserLoginForm } from "@/components/public/UserLoginForm";
import { getI18n } from "@/lib/i18n-server";

export default async function UserLoginPage(props: { searchParams: Promise<{ next?: string }> }) {
  const { locale } = await getI18n();
  const searchParams = await props.searchParams;
  const nextUrl = searchParams.next ?? "/pkpu";
  return <UserLoginForm nextUrl={nextUrl} locale={locale} />;
}
