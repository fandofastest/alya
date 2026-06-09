import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getI18n } from "@/lib/i18n-server";

export default async function AdminLoginPage() {
  const { locale } = await getI18n();
  return <AdminLoginForm locale={locale} />;
}

