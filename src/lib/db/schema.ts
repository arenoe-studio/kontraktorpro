import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "contractor",
  "moderator",
  "super_admin",
]);

export const authIntentEnum = pgEnum("auth_intent", [
  "register",
  "login",
  "forgot-password",
]);
export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "business",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "active",
  "delayed",
  "completed",
  "archived",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "draft",
  "submitted",
  "flagged",
]);
export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  businessName: varchar("business_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 24 }).unique(),
  city: varchar("city", { length: 120 }).notNull(),
  role: roleEnum("role").default("contractor").notNull(),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("free")
    .notNull(),
  passwordHash: text("password_hash").notNull(),
  suspended: boolean("suspended").default(false).notNull(),
  firstLogin: boolean("first_login").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contractorProfiles = pgTable("contractor_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  headline: varchar("headline", { length: 255 }),
  about: text("about"),
  specialties: varchar("specialties", { length: 120 }).array(),
  heroImage: text("hero_image"),
  phoneVisible: boolean("phone_visible").default(false).notNull(),
  verifiedProjects: integer("verified_projects").default(0).notNull(),
  rating: integer("rating").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  type: varchar("type", { length: 120 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  ownerName: varchar("owner_name", { length: 180 }).notNull(),
  status: projectStatusEnum("status").default("draft").notNull(),
  progress: integer("progress").default(0).notNull(),
  contractValue: integer("contract_value").default(0).notNull(),
  isOwnerTrackingEnabled: boolean("is_owner_tracking_enabled")
    .default(false)
    .notNull(),
  targetDate: date("target_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 24 }),
  role: varchar("role", { length: 80 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  tier: subscriptionTierEnum("tier").default("free").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  renewsAt: timestamp("renews_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contractorReviews = pgTable("contractor_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractorId: uuid("contractor_id").notNull(),
  reviewerName: varchar("reviewer_name", { length: 160 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  status: moderationStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id"),
  action: varchar("action", { length: 120 }).notNull(),
  targetType: varchar("target_type", { length: 120 }).notNull(),
  targetId: uuid("target_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wbsStatusEnum = pgEnum("wbs_status", [
  "Belum Dimulai",
  "Dalam Pengerjaan",
  "Tertunda",
  "Selesai",
]);

export const wbsItems = pgTable("wbs_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  parentId: uuid("parent_id"), // for hierarchy (level 1 vs level 2)
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  weight: integer("weight").notNull(), // percentage
  volume: varchar("volume", { length: 120 }), // e.g. "100 m2"
  progress: integer("progress").default(0).notNull(), // 0-100
  status: wbsStatusEnum("status").default("Belum Dimulai").notNull(),
  assignee: varchar("assignee", { length: 180 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyReports = pgTable("daily_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  authorId: uuid("author_id"),
  status: reportStatusEnum("status").default("draft").notNull(),
  weather: varchar("weather", { length: 80 }),
  hasIssue: boolean("has_issue").default(false).notNull(),
  updatedItemsCount: integer("updated_items_count").default(0).notNull(),
  photosCount: integer("photos_count").default(0).notNull(),
  notes: text("notes"),
  reportDate: date("report_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioEntries = pgTable("portfolio_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  status: moderationStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const otpChallenges = pgTable("otp_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  flow: authIntentEnum("flow").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  resendAvailableAt: timestamp("resend_available_at").notNull(),
  resendCount: integer("resend_count").default(0).notNull(),
  attemptsRemaining: integer("attempts_remaining").default(5).notNull(),
  lockedUntil: timestamp("locked_until"),
  isVerified: boolean("is_verified").default(false).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 80 }).notNull(), // e.g., "100 sak"
  supplier: varchar("supplier", { length: 180 }),
  recordedBy: varchar("recorded_by", { length: 160 }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const materialUsages = pgTable("material_usages", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  wbsItemId: uuid("wbs_item_id"), // Optional, linked to WBS item
  wbsItemName: varchar("wbs_item_name", { length: 255 }), // Denormalized or fallback
  materialName: varchar("material_name", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 80 }).notNull(), // e.g., "5 sak"
  note: text("note"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectPhotos = pgTable("project_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  uploaderName: varchar("uploader_name", { length: 160 }),
  wbsItemId: uuid("wbs_item_id"), // linked to WBS item if specific
  wbsItemName: varchar("wbs_item_name", { length: 255 }), // fallback for label
  url: text("url").notNull(),
  angle: varchar("angle", { length: 120 }), // e.g. "Tampak Depan", "Detail"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
