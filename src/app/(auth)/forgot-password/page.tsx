import { getPasswordResetStateFromCookie } from "@/features/auth/actions";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ForgotPasswordFlow } from "@/features/auth/components/forgot-password-flow";

export default async function ForgotPasswordPage() {
  const state = await getPasswordResetStateFromCookie();

  return (
    <AuthShell showBrandPanel={false}>
      <ForgotPasswordFlow initialState={state} />
    </AuthShell>
  );
}
