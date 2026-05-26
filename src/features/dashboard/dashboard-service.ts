/**
 * Dashboard Service — getDashboardData
 *
 * Fungsi utama yang mengambil dan mengagregasi semua data dashboard
 * dari database untuk satu kontraktor. Dipanggil dari Server Component
 * `src/app/(app)/dashboard/page.tsx`.
 *
 * Pola eksekusi:
 * 1. Query projects (sequential — dibutuhkan untuk mendapatkan projectIds)
 * 2. Query daily_reports, activity_logs, project_members, portfolio_entries (paralel)
 * 3. Agregasi semua data menjadi DashboardSummary
 *
 * Error handling:
 * - Query projects gagal → exception propagate ke Next.js error boundary
 * - Query activity_logs gagal → partial failure: activities: [], activityLoadError: true
 * - Tabel photos/materials belum ada → graceful degradation: return 0
 *
 * @see src/features/dashboard/types.ts
 * @see src/features/dashboard/helpers.ts
 * @see src/app/(app)/dashboard/page.tsx
 */

import { and, desc, eq, inArray, or } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  activityLogs,
  dailyReports,
  portfolioEntries,
  projectMembers,
  projects,
  users,
} from "@/lib/db/schema";

import {
  buildReminders,
  calcDaysRemaining,
  formatRelativeTime,
  getGreetingLabel,
  isAtProjectLimit,
  mapActionLabel,
  sortActiveProjects,
  toWIB,
} from "./helpers";
import type {
  ActiveProjectItem,
  DashboardActivity,
  DashboardSummary,
  NearDeadlineProject,
} from "./types";

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Ambil dan agregasi semua data dashboard untuk satu kontraktor.
 *
 * @param userId - ID pengguna dari sesi aktif (sudah divalidasi oleh requireRole)
 * @returns DashboardSummary yang berisi semua data yang dibutuhkan DashboardPage
 * @throws Exception jika query projects atau users gagal (ditangkap error boundary)
 */
export async function getDashboardData(userId: string): Promise<DashboardSummary> {
  const now = new Date();
  const nowWIB = toWIB(now);

  // -------------------------------------------------------------------------
  // Step 0 — Query user untuk fullName dan subscriptionTier
  // -------------------------------------------------------------------------
  // DbUser dari session tidak menyertakan subscriptionTier, jadi kita query
  // langsung dari tabel users. Exception dibiarkan propagate ke error boundary.
  const [userRow] = await db
    .select({
      fullName: users.fullName,
      subscriptionTier: users.subscriptionTier,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const fullName = userRow?.fullName ?? "";
  const subscriptionTier = userRow?.subscriptionTier ?? "free";

  // -------------------------------------------------------------------------
  // Step 1 — Query semua proyek milik user
  // -------------------------------------------------------------------------
  // Exception dibiarkan propagate — jika ini gagal, dashboard tidak bisa
  // ditampilkan sama sekali.
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, userId));

  const projectIds = allProjects.map((p) => p.id);

  // -------------------------------------------------------------------------
  // Early return — user belum punya proyek
  // -------------------------------------------------------------------------
  if (projectIds.length === 0) {
    const greetingLabel = getGreetingLabel(nowWIB.getUTCHours());

    return {
      fullName,
      greetingLabel,
      activeProjectCount: 0,
      pendingReportCount: 0,
      reportCompletionToday: "0/0",
      averageProgress: 0,
      finishedThisMonth: 0,
      nearDeadlineProjects: [],
      reminders: [],
      activeProjects: [],
      activities: [],
      activityLoadError: false,
      nearestDeadlineDays: 0,
      photosToday: 0,
      materialsRecordedTotal: 0,
      activeMemberCount: 0,
      isProjectLimitReached: isAtProjectLimit(0, subscriptionTier),
    };
  }

  // -------------------------------------------------------------------------
  // Step 2 — Paralel queries
  // -------------------------------------------------------------------------

  // Activity logs diambil terpisah dengan try-catch untuk partial failure
  let rawActivities: typeof activityLogs.$inferSelect[] = [];
  let activityLoadError = false;

  const [rawReports, rawMembers, rawPortfolios] = await Promise.all([
    // Query 1: daily_reports untuk semua proyek user
    db
      .select()
      .from(dailyReports)
      .where(inArray(dailyReports.projectId, projectIds)),

    // Query 2: project_members aktif untuk semua proyek user
    db
      .select()
      .from(projectMembers)
      .where(
        and(
          inArray(projectMembers.projectId, projectIds),
          eq(projectMembers.isActive, true)
        )
      ),

    // Query 3: portfolio_entries untuk semua proyek user
    db
      .select()
      .from(portfolioEntries)
      .where(inArray(portfolioEntries.projectId, projectIds)),
  ]);

  // Activity logs — partial failure pattern
  try {
    rawActivities = await db
      .select()
      .from(activityLogs)
      .where(
        or(
          eq(activityLogs.actorId, userId),
          and(
            eq(activityLogs.targetType, "project"),
            inArray(activityLogs.targetId, projectIds)
          )
        )
      )
      .orderBy(desc(activityLogs.createdAt))
      .limit(10);
  } catch {
    activityLoadError = true;
  }

  // -------------------------------------------------------------------------
  // Step 3 — Agregasi
  // -------------------------------------------------------------------------

  // --- Greeting ---
  const greetingLabel = getGreetingLabel(nowWIB.getUTCHours());

  // --- Tanggal hari ini dalam WIB (untuk perbandingan kalender) ---
  const todayWIBYear = nowWIB.getUTCFullYear();
  const todayWIBMonth = nowWIB.getUTCMonth();
  const todayWIBDate = nowWIB.getUTCDate();

  // --- Bulan ini dalam WIB (untuk finishedThisMonth) ---
  const thisMonthWIBYear = todayWIBYear;
  const thisMonthWIBMonth = todayWIBMonth;

  // --- Proyek aktif/delayed ---
  const activeDelayedProjects = allProjects.filter(
    (p) => p.status === "active" || p.status === "delayed"
  );
  const activeProjectCount = activeDelayedProjects.length;

  // --- Set: project IDs yang sudah submit laporan hari ini (WIB) ---
  const projectsWithReportToday = new Set<string>();
  for (const report of rawReports) {
    if (report.status === "submitted") {
      const reportWIB = toWIB(report.createdAt);
      if (
        reportWIB.getUTCFullYear() === todayWIBYear &&
        reportWIB.getUTCMonth() === todayWIBMonth &&
        reportWIB.getUTCDate() === todayWIBDate
      ) {
        projectsWithReportToday.add(report.projectId);
      }
    }
  }

  // --- pendingReportCount ---
  const pendingReportCount = activeDelayedProjects.filter(
    (p) => !projectsWithReportToday.has(p.id)
  ).length;

  // --- reportCompletionToday ---
  const reportedCount = activeDelayedProjects.filter((p) =>
    projectsWithReportToday.has(p.id)
  ).length;
  const reportCompletionToday =
    activeProjectCount === 0
      ? "0/0"
      : `${reportedCount}/${activeProjectCount}`;

  // --- averageProgress ---
  const averageProgress =
    activeProjectCount === 0
      ? 0
      : Math.round(
          activeDelayedProjects.reduce((sum, p) => sum + p.progress, 0) /
            activeProjectCount
        );

  // --- finishedThisMonth ---
  const finishedThisMonth = allProjects.filter((p) => {
    if (p.status !== "completed" || !p.completedAt) return false;
    const completedWIB = toWIB(p.completedAt);
    return (
      completedWIB.getUTCFullYear() === thisMonthWIBYear &&
      completedWIB.getUTCMonth() === thisMonthWIBMonth
    );
  }).length;

  // --- nearDeadlineProjects (daysRemaining ≤ 7) ---
  const nearDeadlineProjects: NearDeadlineProject[] = [];
  for (const p of activeDelayedProjects) {
    if (!p.targetDate) continue;
    // targetDate dari Drizzle date() adalah string "YYYY-MM-DD"
    const targetDateObj = new Date(`${p.targetDate}T00:00:00Z`);
    const daysRemaining = calcDaysRemaining(targetDateObj, now);
    if (daysRemaining <= 7) {
      nearDeadlineProjects.push({
        id: p.id,
        name: p.name,
        targetDate: p.targetDate,
        daysRemaining,
      });
    }
  }

  // --- Set: project IDs yang sudah punya portfolio entry (pending atau approved) ---
  // "Has portfolio" = minimal satu entry dengan status pending atau approved (bukan rejected)
  const projectsWithPortfolio = new Set<string>();
  for (const entry of rawPortfolios) {
    if (entry.status === "pending" || entry.status === "approved") {
      projectsWithPortfolio.add(entry.projectId);
    }
  }

  // --- Reminders ---
  // buildReminders menangani danger (no report today) dan warning (near deadline)
  // untuk proyek active/delayed. Success reminders untuk completed projects
  // ditangani di bawah secara terpisah.
  const rawProjectsForReminders = activeDelayedProjects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status as "active" | "delayed",
    targetDate: p.targetDate ? new Date(`${p.targetDate}T00:00:00Z`) : null,
  }));

  const baseReminders = buildReminders({
    activeProjects: rawProjectsForReminders,
    projectsWithReportToday,
    projectsWithPortfolio,
    now,
  });

  // Success reminders: proyek completed tanpa portfolio entry (pending/approved)
  const completedProjects = allProjects.filter((p) => p.status === "completed");
  const successReminders = completedProjects
    .filter((p) => !projectsWithPortfolio.has(p.id))
    .map((p) => ({
      id: `success-portfolio-${p.id}`,
      type: "success" as const,
      title: "Proyek selesai, tambahkan ke portofolio",
      description: `Proyek "${p.name}" sudah selesai. Tambahkan ke portofolio untuk menarik klien baru.`,
      actionLabel: "Tambah Portofolio",
      href: `/projects/${p.id}/portfolio/new`,
    }));

  // Gabungkan dan batasi 5 item (danger → warning → success → info)
  const REMINDER_PRIORITY: Record<string, number> = {
    danger: 0,
    warning: 1,
    success: 2,
    info: 3,
  };
  const allReminders = [...baseReminders, ...successReminders]
    .sort((a, b) => REMINDER_PRIORITY[a.type] - REMINDER_PRIORITY[b.type])
    .slice(0, 5);

  // --- activeProjects (Blok D) ---
  const sortedActiveProjects = sortActiveProjects(rawProjectsForReminders);
  const top5ActiveProjects = sortedActiveProjects.slice(0, 5);

  // Hitung reportCount per project
  const reportCountByProject = new Map<string, number>();
  for (const report of rawReports) {
    reportCountByProject.set(
      report.projectId,
      (reportCountByProject.get(report.projectId) ?? 0) + 1
    );
  }

  const activeProjects: ActiveProjectItem[] = top5ActiveProjects.map((p) => {
    const daysRemaining = p.targetDate
      ? calcDaysRemaining(p.targetDate, now)
      : null;
    // Cari data lengkap dari allProjects untuk ownerName, type, location
    const fullProject = allProjects.find((ap) => ap.id === p.id)!;
    return {
      id: p.id,
      name: p.name,
      type: fullProject.type,
      location: fullProject.location,
      ownerName: fullProject.ownerName,
      status: p.status,
      progress: fullProject.progress,
      targetDate: fullProject.targetDate ?? null,
      daysRemaining,
      reportCount: reportCountByProject.get(p.id) ?? 0,
      photoCount: 0, // Tabel project_photos belum tersedia
    };
  });

  // --- Activities (Blok E) ---
  const activities: DashboardActivity[] = rawActivities.map((log) => ({
    id: log.id,
    type: "info" as const,
    description: mapActionLabel(log.action),
    time: formatRelativeTime(log.createdAt, now),
    createdAt: log.createdAt,
  }));

  // --- Secondary stats ---

  // nearestDeadlineDays: hari menuju deadline proyek aktif yang paling dekat
  let nearestDeadlineDays = 0;
  const deadlineDays = activeDelayedProjects
    .filter((p) => p.targetDate !== null)
    .map((p) => calcDaysRemaining(new Date(`${p.targetDate}T00:00:00Z`), now));
  if (deadlineDays.length > 0) {
    nearestDeadlineDays = Math.min(...deadlineDays);
  }

  // photosToday: 0 — tabel project_photos belum tersedia
  const photosToday = 0;

  // materialsRecordedTotal: 0 — tabel material_entries belum tersedia
  const materialsRecordedTotal = 0;

  // activeMemberCount: jumlah project_members aktif lintas semua proyek user
  const activeMemberCount = rawMembers.length;

  // --- isProjectLimitReached ---
  const isProjectLimitReached = isAtProjectLimit(activeProjectCount, subscriptionTier);

  // -------------------------------------------------------------------------
  // Return DashboardSummary
  // -------------------------------------------------------------------------
  return {
    fullName,
    greetingLabel,
    activeProjectCount,
    pendingReportCount,
    reportCompletionToday,
    averageProgress,
    finishedThisMonth,
    nearDeadlineProjects,
    reminders: allReminders,
    activeProjects,
    activities,
    activityLoadError,
    nearestDeadlineDays,
    photosToday,
    materialsRecordedTotal,
    activeMemberCount,
    isProjectLimitReached,
  };
}
