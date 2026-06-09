import { UserLoginForm } from "@/components/public/UserLoginForm";

export default async function UserLoginPage(props: { searchParams: Promise<{ next?: string }> }) {
  const searchParams = await props.searchParams;
  const nextUrl = searchParams.next ?? "/pkpu";
  return <UserLoginForm nextUrl={nextUrl} />;
}
