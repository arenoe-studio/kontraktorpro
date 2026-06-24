import { and, eq, ilike, inArray, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyReports, projects } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { calcDaysRemaining } from "@/features/dashboard/helpers";

import { type ProjectStatus } from "@/lib/contracts/enums";

export type ProjectListItem = {
  id: string;
  name: string;
  type: string;
  owner: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  targetDate: string | null;
  startDate: string;
  daysRemaining: number;
  photoCount: number;
  reportCount: number;
};

export type ProjectCounts = {
  semua: number;
  aktif: number;
  tertunda: number;
  selesai: number;
  arsip: number;
};

/**
 * Get project counts by status for a specific user
 */
export async function getProjectCounts(userId: string): Promise<ProjectCounts> {
  const allProjects = await db
    .select({ status: projects.status })
    .from(projects)
    .where(eq(projects.ownerId, userId));

  return {
    semua: allProjects.filter((p) => p.status !== "archived").length,
    aktif: allProjects.filter((p) => p.status === "active").length,
    tertunda: allProjects.filter((p) => p.status === "delayed").length,
    selesai: allProjects.filter((p) => p.status === "completed").length,
    arsip: allProjects.filter((p) => p.status === "archived").length,
  };
}

/**
 * Get list of projects with filtering and sorting
 */
export async function getProjectsList(
  userId: string,
  filters: { status: string; q: string; sort: string }
): Promise<ProjectListItem[]> {
  const { status, q, sort } = filters;

  // Build conditions
  const conditions = [eq(projects.ownerId, userId)];

  if (status !== "semua") {
    conditions.push(eq(projects.status, status as any));
  } else {
    conditions.push(ne(projects.status, "archived"));
  }

  if (q) {
    const searchPattern = `%${q}%`;
    conditions.push(
      or(
        ilike(projects.name, searchPattern),
        ilike(projects.ownerName, searchPattern)
      ) as any
    );
  }

  // Execute projects query
  let rawProjects = await db
    .select()
    .from(projects)
    .where(and(...conditions));

  if (rawProjects.length === 0) {
    return [];
  }

  // Get project IDs to fetch related data
  const projectIds = rawProjects.map((p) => p.id);

  // Fetch report counts
  const rawReports = await db
    .select({ projectId: dailyReports.projectId })
    .from(dailyReports)
    .where(inArray(dailyReports.projectId, projectIds));

  const reportCountByProject = new Map<string, number>();
  for (const report of rawReports) {
    reportCountByProject.set(
      report.projectId,
      (reportCountByProject.get(report.projectId) ?? 0) + 1
    );
  }

  const now = new Date();

  // Map to list items
  let listItems: ProjectListItem[] = rawProjects.map((p) => {
    const daysRemaining = p.targetDate
      ? calcDaysRemaining(new Date(`${p.targetDate}T00:00:00Z`), now)
      : 0; // default 0 if no target date

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      owner: p.ownerName,
      location: p.location,
      status: p.status,
      progress: p.progress,
      targetDate: p.targetDate,
      startDate: p.createdAt.toISOString(),
      daysRemaining,
      photoCount: 0, // Mock for now until photos table exists
      reportCount: reportCountByProject.get(p.id) ?? 0,
    };
  });

  // Sort
  listItems.sort((left, right) => {
    if (sort === "deadline") return left.daysRemaining - right.daysRemaining;
    if (sort === "progress-low") return left.progress - right.progress;
    return right.startDate.localeCompare(left.startDate);
  });

  return listItems;
}

export async function getProjectById(projectId: string, ownerId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .limit(1);

  return project || null;
}

export async function createProject(ownerId: string, data: {
  name: string;
  type: string;
  location: string;
  ownerName: string;
  contractValue: number;
  targetDate?: string;
}) {
  const targetDateStr = data.targetDate ? data.targetDate : null;

  const [inserted] = await db.insert(projects).values({
    ownerId,
    name: data.name,
    type: data.type,
    location: data.location,
    ownerName: data.ownerName,
    contractValue: data.contractValue,
    targetDate: targetDateStr,
    status: "active", // default new projects to active
  }).returning();

  return inserted;
}

export async function updateProject(projectId: string, ownerId: string, data: {
  name: string;
  type: string;
  location: string;
  ownerName: string;
  contractValue: number;
  targetDate?: string;
}) {
  const targetDateStr = data.targetDate ? data.targetDate : null;

  const [updated] = await db.update(projects).set({
    name: data.name,
    type: data.type,
    location: data.location,
    ownerName: data.ownerName,
    contractValue: data.contractValue,
    targetDate: targetDateStr,
    updatedAt: new Date(),
  })
  .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
  .returning();

  return updated || null;
}

export async function deleteProject(projectId: string, ownerId: string) {
  const project = await getProjectById(projectId, ownerId);
  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  // Use a transaction to delete child records manually, because we don't have
  // onDelete: 'cascade' set in Drizzle schema yet.
  // PENTING (TECHNICAL DEBT): Fungsi ini WAJIB diperbarui secara manual setiap kali 
  // ada penambahan tabel baru yang memiliki relasi (Foreign Key) ke tabel `projects`.
  await db.transaction(async (tx) => {
    // Delete child rows first
    await tx.delete(schema.projectMembers).where(eq(schema.projectMembers.projectId, projectId));
    await tx.delete(schema.wbsItems).where(eq(schema.wbsItems.projectId, projectId));
    await tx.delete(schema.dailyReports).where(eq(schema.dailyReports.projectId, projectId));
    await tx.delete(schema.portfolioEntries).where(eq(schema.portfolioEntries.projectId, projectId));
    await tx.delete(schema.materials).where(eq(schema.materials.projectId, projectId));
    await tx.delete(schema.materialUsages).where(eq(schema.materialUsages.projectId, projectId));
    await tx.delete(schema.projectPhotos).where(eq(schema.projectPhotos.projectId, projectId));

    // Delete the project itself
    await tx.delete(projects).where(eq(projects.id, projectId));
  });

  return true;
}
