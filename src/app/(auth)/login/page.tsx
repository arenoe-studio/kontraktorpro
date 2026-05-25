import { LoginPage } from "../_components/LoginPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return <LoginPage searchParams={searchParams} />;
}
