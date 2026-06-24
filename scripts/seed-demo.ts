/**
 * Seed script for demo account: arenoe.studio@gmail.com
 *
 * Idempotent — safe to run multiple times without creating duplicates.
 * Run with: npx tsx scripts/seed-demo.ts
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { eq, and, sql } from "drizzle-orm";
import { db } from "../src/lib/db";
import {
  users,
  projects,
  dailyReports,
  activityLogs,
  projectMembers,
} from "../src/lib/db/schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Format a Date as "YYYY-MM-DD" (local calendar date, no timezone shift) */
function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const DEMO_EMAIL = "arenoe.studio@gmail.com";
  const now = new Date();

  // -------------------------------------------------------------------------
  // 1. Find demo user
  // -------------------------------------------------------------------------
  const [demoUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, DEMO_EMAIL))
    .limit(1);

  if (!demoUser) {
    console.warn(`⚠ Demo user not found: ${DEMO_EMAIL}. Exiting without changes.`);
    process.exit(0);
  }

  console.log(`✓ Found demo user: ${demoUser.fullName} (${demoUser.email})`);

  // -------------------------------------------------------------------------
  // 2. Update user identity if needed
  // -------------------------------------------------------------------------
  const TARGET_FULL_NAME = "Budi Santoso";
  const TARGET_BUSINESS_NAME = "CV Maju Jaya Konstruksi";

  if (
    demoUser.fullName !== TARGET_FULL_NAME ||
    demoUser.businessName !== TARGET_BUSINESS_NAME
  ) {
    await db
      .update(users)
      .set({ fullName: TARGET_FULL_NAME, businessName: TARGET_BUSINESS_NAME })
      .where(eq(users.id, demoUser.id));
    console.log(
      `✓ Updated user identity → fullName: "${TARGET_FULL_NAME}", businessName: "${TARGET_BUSINESS_NAME}"`
    );
  } else {
    console.log(`✓ User identity already up-to-date`);
  }

  const userId = demoUser.id;

  // -------------------------------------------------------------------------
  // 3. Seed 3 projects (idempotent: check by name + ownerId)
  // -------------------------------------------------------------------------

  // targetDate for project 1: 5 days from now (triggers near-deadline warning)
  const targetDate1 = toDateString(addDays(now, 5));
  // targetDate for project 2: 2 days ago (already past, triggers warning)
  const targetDate2 = toDateString(addDays(now, -2));
  // completedAt for project 3: this month
  const completedAt3 = new Date(now.getFullYear(), now.getMonth(), 10);

  const projectDefs = [
    {
      name: "Renovasi Rumah Pak Hasan",
      type: "Renovasi",
      location: "Bekasi Timur",
      ownerName: "Pak Hasan",
      progress: 65,
      contractValue: 285_000_000,
      targetDate: targetDate1,
      completedAt: null,
      status: "active" as const,
    },
    {
      name: "Interior Kafe Melati",
      type: "Renovasi",
      location: "Depok",
      ownerName: "Mas Aldi",
      progress: 30,
      contractValue: 162_000_000,
      targetDate: targetDate2,
      completedAt: null,
      status: "delayed" as const,
    },
    {
      name: "Rumah Ibu Siska Cibubur",
      type: "Rumah Tinggal Baru",
      location: "Cibubur",
      ownerName: "Ibu Siska",
      progress: 100,
      contractValue: 935_000_000,
      targetDate: null,
      completedAt: completedAt3,
      status: "completed" as const,
    },
  ];

  const seededProjects: Array<{ id: string; name: string }> = [];

  for (const def of projectDefs) {
    // Check if project already exists by name + ownerId
    const [existing] = await db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .where(and(eq(projects.name, def.name), eq(projects.ownerId, userId)))
      .limit(1);

    if (existing) {
      console.log(`  ↳ Project already exists: "${def.name}" (${existing.id})`);
      seededProjects.push(existing);
    } else {
      const [inserted] = await db
        .insert(projects)
        .values({
          ownerId: userId,
          name: def.name,
          type: def.type,
          location: def.location,
          ownerName: def.ownerName,
          progress: def.progress,
          contractValue: def.contractValue,
          targetDate: def.targetDate,
          completedAt: def.completedAt,
          status: def.status,
        })
        .returning({ id: projects.id, name: projects.name });

      console.log(`  ↳ Inserted project: "${inserted.name}" (${inserted.id})`);
      seededProjects.push(inserted);
    }
  }

  console.log(`✓ Seeded 3 projects`);

  const [project1, project2, project3] = seededProjects;

  // -------------------------------------------------------------------------
  // 4. Seed daily_reports (idempotent: check by projectId + date)
  //    Project 1 (active): 5 reports on past dates (NOT today → triggers danger reminder)
  //    Project 2 (delayed): 3 reports on past dates
  //    Project 3 (completed): 8 reports on past dates
  // -------------------------------------------------------------------------

  const reportDefs: Array<{
    projectId: string;
    daysAgo: number;
    weather: string;
    notes: string;
  }> = [
    // Project 1 — 5 reports, none today
    { projectId: project1.id, daysAgo: 1, weather: "Cerah", notes: "Pengecoran lantai 2 selesai 80%" },
    { projectId: project1.id, daysAgo: 2, weather: "Berawan", notes: "Pemasangan rangka atap dimulai" },
    { projectId: project1.id, daysAgo: 3, weather: "Cerah", notes: "Plesteran dinding selesai" },
    { projectId: project1.id, daysAgo: 5, weather: "Hujan ringan", notes: "Pekerjaan ditunda karena hujan" },
    { projectId: project1.id, daysAgo: 7, weather: "Cerah", notes: "Pondasi selesai 100%" },

    // Project 2 — 3 reports
    { projectId: project2.id, daysAgo: 2, weather: "Cerah", notes: "Pemasangan partisi ruangan" },
    { projectId: project2.id, daysAgo: 4, weather: "Berawan", notes: "Pengecatan dinding selesai 50%" },
    { projectId: project2.id, daysAgo: 6, weather: "Cerah", notes: "Instalasi listrik dimulai" },

    // Project 3 — 8 reports
    { projectId: project3.id, daysAgo: 10, weather: "Cerah", notes: "Serah terima proyek kepada pemilik" },
    { projectId: project3.id, daysAgo: 12, weather: "Cerah", notes: "Finishing cat eksterior selesai" },
    { projectId: project3.id, daysAgo: 15, weather: "Berawan", notes: "Pemasangan keramik lantai selesai" },
    { projectId: project3.id, daysAgo: 18, weather: "Cerah", notes: "Instalasi sanitasi selesai" },
    { projectId: project3.id, daysAgo: 20, weather: "Cerah", notes: "Pemasangan kusen pintu dan jendela" },
    { projectId: project3.id, daysAgo: 25, weather: "Hujan", notes: "Pekerjaan struktur atap selesai" },
    { projectId: project3.id, daysAgo: 30, weather: "Cerah", notes: "Pengecoran sloof selesai" },
    { projectId: project3.id, daysAgo: 35, weather: "Cerah", notes: "Galian pondasi selesai" },
  ];

  let reportInsertCount = 0;
  let reportSkipCount = 0;

  for (const r of reportDefs) {
    const reportDate = addDays(now, -r.daysAgo);
    const reportDateStr = toDateString(reportDate);

    // Check by projectId + date (using date truncation on createdAt)
    const [existing] = await db
      .select({ id: dailyReports.id })
      .from(dailyReports)
      .where(
        and(
          eq(dailyReports.projectId, r.projectId),
          sql`DATE(${dailyReports.createdAt}) = ${reportDateStr}`
        )
      )
      .limit(1);

    if (existing) {
      reportSkipCount++;
    } else {
      await db.insert(dailyReports).values({
        projectId: r.projectId,
        authorId: userId,
        status: "submitted",
        weather: r.weather,
        notes: r.notes,
        reportDate: reportDateStr,
        createdAt: reportDate,
      });
      reportInsertCount++;
    }
  }

  console.log(
    `✓ Seeded daily_reports: ${reportInsertCount} inserted, ${reportSkipCount} already existed`
  );

  // -------------------------------------------------------------------------
  // 5. Seed activity_logs (idempotent: check by actorId + action + targetId + date)
  //    At least 8 entries with varied actions spread across last 7 days
  // -------------------------------------------------------------------------

  const activityDefs: Array<{
    actorId: string;
    action: string;
    targetType: string;
    targetId: string;
    daysAgo: number;
    metadata?: string;
  }> = [
    {
      actorId: userId,
      action: "project_created",
      targetType: "project",
      targetId: project1.id,
      daysAgo: 7,
      metadata: JSON.stringify({ projectName: project1.name }),
    },
    {
      actorId: userId,
      action: "project_created",
      targetType: "project",
      targetId: project2.id,
      daysAgo: 6,
      metadata: JSON.stringify({ projectName: project2.name }),
    },
    {
      actorId: userId,
      action: "report_submitted",
      targetType: "project",
      targetId: project1.id,
      daysAgo: 1,
      metadata: JSON.stringify({ reportDate: toDateString(addDays(now, -1)) }),
    },
    {
      actorId: userId,
      action: "report_submitted",
      targetType: "project",
      targetId: project2.id,
      daysAgo: 2,
      metadata: JSON.stringify({ reportDate: toDateString(addDays(now, -2)) }),
    },
    {
      actorId: userId,
      action: "photo_uploaded",
      targetType: "project",
      targetId: project1.id,
      daysAgo: 3,
      metadata: JSON.stringify({ count: 4 }),
    },
    {
      actorId: userId,
      action: "member_added",
      targetType: "project",
      targetId: project1.id,
      daysAgo: 5,
      metadata: JSON.stringify({ memberName: "Deni Saputra" }),
    },
    {
      actorId: userId,
      action: "status_changed",
      targetType: "project",
      targetId: project2.id,
      daysAgo: 4,
      metadata: JSON.stringify({ from: "active", to: "delayed" }),
    },
    {
      actorId: userId,
      action: "material_recorded",
      targetType: "project",
      targetId: project1.id,
      daysAgo: 2,
      metadata: JSON.stringify({ material: "Semen Portland", qty: 50, unit: "sak" }),
    },
    {
      actorId: userId,
      action: "status_changed",
      targetType: "project",
      targetId: project3.id,
      daysAgo: 10,
      metadata: JSON.stringify({ from: "active", to: "completed" }),
    },
    {
      actorId: userId,
      action: "photo_uploaded",
      targetType: "project",
      targetId: project3.id,
      daysAgo: 6,
      metadata: JSON.stringify({ count: 8 }),
    },
  ];

  let activityInsertCount = 0;
  let activitySkipCount = 0;

  for (const a of activityDefs) {
    const activityDate = addDays(now, -a.daysAgo);
    const activityDateStr = toDateString(activityDate);

    // Check by actorId + action + targetId + date
    const [existing] = await db
      .select({ id: activityLogs.id })
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.actorId, a.actorId),
          eq(activityLogs.action, a.action),
          eq(activityLogs.targetId, a.targetId),
          sql`DATE(${activityLogs.createdAt}) = ${activityDateStr}`
        )
      )
      .limit(1);

    if (existing) {
      activitySkipCount++;
    } else {
      await db.insert(activityLogs).values({
        actorId: a.actorId,
        action: a.action,
        targetType: a.targetType,
        targetId: a.targetId,
        metadata: a.metadata ?? null,
        createdAt: activityDate,
      });
      activityInsertCount++;
    }
  }

  console.log(
    `✓ Seeded activity_logs: ${activityInsertCount} inserted, ${activitySkipCount} already existed`
  );

  // -------------------------------------------------------------------------
  // 6. Seed project_members (idempotent: check by projectId + name)
  //    Project 1: 3 members
  //    Project 2: 2 members
  // -------------------------------------------------------------------------

  const memberDefs: Array<{
    projectId: string;
    name: string;
    role: string;
    phone?: string;
  }> = [
    // Project 1
    { projectId: project1.id, name: "Deni Saputra", role: "Mandor", phone: "081234567890" },
    { projectId: project1.id, name: "Farid Kurniawan", role: "Spesialis", phone: "081234567891" },
    { projectId: project1.id, name: "Rian Hidayat", role: "Pekerja Harian" },
    // Project 2
    { projectId: project2.id, name: "Bowo Santoso", role: "Mandor", phone: "081234567892" },
    { projectId: project2.id, name: "Agus Purnomo", role: "Pekerja Harian" },
  ];

  let memberInsertCount = 0;
  let memberSkipCount = 0;

  for (const m of memberDefs) {
    const [existing] = await db
      .select({ id: projectMembers.id })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, m.projectId),
          eq(projectMembers.name, m.name)
        )
      )
      .limit(1);

    if (existing) {
      memberSkipCount++;
    } else {
      await db.insert(projectMembers).values({
        projectId: m.projectId,
        name: m.name,
        role: m.role,
        phone: m.phone ?? null,
        isActive: true,
      });
      memberInsertCount++;
    }
  }

  console.log(
    `✓ Seeded project_members: ${memberInsertCount} inserted, ${memberSkipCount} already existed`
  );

  // -------------------------------------------------------------------------
  // 7. No portfolio_entries for project3 — intentionally omitted
  //    This triggers the "success" reminder in the dashboard
  // -------------------------------------------------------------------------
  console.log(`✓ portfolio_entries intentionally skipped for "${project3.name}" (triggers success reminder)`);

  // -------------------------------------------------------------------------
  // Done
  // -------------------------------------------------------------------------
  console.log("\n✅ Seed complete. Demo account is ready.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
