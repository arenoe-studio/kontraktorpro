import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell>
      <LoginForm defaultPhone={params.phone} />
    </AuthShell>
  );
}
