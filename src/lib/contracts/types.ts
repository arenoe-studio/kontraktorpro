import type {
  ModerationStatus,
  ProjectStatus,
  ReportStatus,
  Role,
  SubscriptionTier,
  TeamRole,
} from "./enums";

export type User = {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  city: string;
  role: Role;
  subscriptionTier: SubscriptionTier;
};

export type ContractorProfile = {
  slug: string;
  headline: string;
  city: string;
  verifiedProjects: number;
  rating: number;
  about: string;
  specialties: string[];
};

export type Project = {
  id: string;
  name: string;
  type: string;
  location: string;
  ownerName: string;
  status: ProjectStatus;
  progress: number;
  daysRemaining: number;
  reportsCount: number;
  photosCount: number;
  contractValue: number;
};

export type WbsItem = {
  id: string;
  projectId: string;
  name: string;
  category: string;
  weight: number;
  volume: string;
  progress: number;
  status: ProjectStatus;
  updatedAt: string;
};

export type DailyReport = {
  id: string;
  projectId: string;
  date: string;
  weather: string;
  author: string;
  updatesCount: number;
  photosCount: number;
  status: ReportStatus;
  hasIssue: boolean;
};

export type ProjectPhoto = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  uploader: string;
  workItem: string;
  url: string;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  name: string;
  role: TeamRole;
  status: "aktif" | "nonaktif";
  reportsSubmitted: number;
};

export type MaterialEntry = {
  id: string;
  projectId: string;
  date: string;
  name: string;
  quantity: string;
  supplier: string;
  recordedBy: string;
};

export type Subscription = {
  id: string;
  tier: SubscriptionTier;
  price: number;
  activeProjectLimit: number;
  pdfReports: boolean;
  ownerTracking: boolean;
  publicPortfolio: boolean;
};

export type PaymentTransaction = {
  id: string;
  tier: SubscriptionTier;
  method: string;
  amount: number;
  status: "pending" | "paid" | "failed";
};

export type PortfolioEntry = {
  id: string;
  title: string;
  location: string;
  finishedAt: string;
  coverImage: string;
  status: ModerationStatus;
};

export type Review = {
  id: string;
  contractorName: string;
  ownerName: string;
  rating: number;
  comment: string;
  status: ModerationStatus;
};

export type AdminActivityLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};
