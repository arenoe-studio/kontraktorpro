import { AccountForm } from "../_components/account-form";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Keamanan Akun</h2>
        <p className="text-sm text-muted-foreground">Kelola kata sandi dan keamanan akun Anda.</p>
      </div>
      
      <AccountForm />
    </div>
  );
}
