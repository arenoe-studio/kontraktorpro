import { ProfileForm } from "../_components/profile-form";
import { getContractorProfile } from "@/features/settings/settings-service";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getContractorProfile(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Profil & Portofolio</h2>
        <p className="text-sm text-muted-foreground">Kelola informasi publik dan portofolio proyek Anda.</p>
      </div>
      
      <ProfileForm 
        initialData={{ 
          fullName: user.fullName,
          businessName: user.businessName,
          headline: profile?.headline || "", 
          about: profile?.about || "" 
        }} 
      />
    </div>
  );
}
