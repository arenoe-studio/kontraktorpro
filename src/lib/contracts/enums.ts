export const roles = ["contractor", "moderator", "super_admin"] as const;
export const subscriptionTiers = ["free", "pro", "business"] as const;
export const projectStatuses = [
  "draft",
  "active",
  "delayed",
  "completed",
  "archived",
] as const;
export const reportStatuses = ["draft", "submitted", "flagged"] as const;
export const moderationStatuses = [
  "pending",
  "approved",
  "rejected",
] as const;
export const teamRoles = ["mandor", "pekerja", "spesialis"] as const;
export const wbsStatuses = [
  "Belum Dimulai",
  "Dalam Pengerjaan",
  "Tertunda",
  "Selesai",
] as const;

export type Role = (typeof roles)[number];
export type SubscriptionTier = (typeof subscriptionTiers)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type ReportStatus = (typeof reportStatuses)[number];
export type ModerationStatus = (typeof moderationStatuses)[number];
export type TeamRole = (typeof teamRoles)[number];
export type WbsStatus = (typeof wbsStatuses)[number];
