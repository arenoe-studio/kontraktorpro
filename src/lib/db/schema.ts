import {
  boolean,
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
  phone: varchar("phone", { length: 24 }).notNull().unique(),
  city: varchar("city", { length: 120 }).notNull(),
  role: roleEnum("role").default("contractor").notNull(),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("free")
    .notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contractorProfiles = pgTable("contractor_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  headline: varchar("headline", { length: 255 }),
  about: text("about"),
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

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id"),
  action: varchar("action", { length: 120 }).notNull(),
  targetType: varchar("target_type", { length: 120 }).notNull(),
  targetId: uuid("target_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyReports = pgTable("daily_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  authorId: uuid("author_id"),
  status: reportStatusEnum("status").default("draft").notNull(),
  weather: varchar("weather", { length: 80 }),
  notes: text("notes"),
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
