import { db } from "@/lib/db";
import {
  projects,
  users,
  contractorProfiles,
  wbsItems,
  projectPhotos,
  dailyReports,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getOwnerTrackingData(projectId: string) {
  // Query project with related contractor user and profile
  const result = await db
    .select({
      project: projects,
      user: users,
      profile: contractorProfiles,
    })
    .from(projects)
    .innerJoin(users, eq(projects.ownerId, users.id))
    .leftJoin(contractorProfiles, eq(users.id, contractorProfiles.userId))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const { project, user, profile } = result[0];

  if (!project.isOwnerTrackingEnabled) {
    return { active: false as const };
  }

  // Fetch WBS items for stats and visible items
  const allWbsItems = await db
    .select()
    .from(wbsItems)
    .where(eq(wbsItems.projectId, projectId));

  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  const visibleItems = allWbsItems.map((item) => {
    if (item.status === "Selesai") completed++;
    else if (item.status === "Dalam Pengerjaan") inProgress++;
    else notStarted++;

    let mappedStatus: "Selesai" | "Berjalan" | "Belum Mulai" = "Belum Mulai";
    if (item.status === "Selesai") mappedStatus = "Selesai";
    else if (item.status === "Dalam Pengerjaan" || item.status === "Tertunda") mappedStatus = "Berjalan";

    return {
      name: item.name,
      progress: item.progress,
      status: mappedStatus,
    };
  });

  // Fetch recent photos
  const photosData = await db
    .select()
    .from(projectPhotos)
    .where(eq(projectPhotos.projectId, projectId))
    .orderBy(desc(projectPhotos.createdAt))
    .limit(6);

  const photos = photosData.map((p) => ({
    label: p.wbsItemName || p.angle || "Dokumentasi Proyek",
    date: p.createdAt.toISOString().split("T")[0],
    url: p.url,
  }));

  // Fetch daily reports for updates
  const reportsData = await db
    .select()
    .from(dailyReports)
    .where(eq(dailyReports.projectId, projectId))
    .orderBy(desc(dailyReports.createdAt))
    .limit(5);

  const updates = reportsData.map((r) => ({
    date: r.reportDate || r.createdAt.toISOString().split("T")[0],
    title: r.status === "submitted" ? "Laporan Disubmit" : "Update Laporan Harian",
    note: r.notes || "Tidak ada catatan",
  }));

  let projectStatus: "Sedang Berjalan" | "Selesai" | "Ditunda" = "Sedang Berjalan";
  if (project.status === "archived") projectStatus = "Selesai";
  else if (project.status === "delayed" || project.status === "draft") projectStatus = "Ditunda";

  return {
    active: true as const,
    projectName: project.name,
    location: project.location,
    status: projectStatus,
    contractorSlug: profile?.slug || "",
    contractorBusiness: user.businessName,
    contractorName: user.fullName,
    updatedAt: project.updatedAt.toISOString().split("T")[0],
    overallProgress: project.progress,
    stats: {
      completed,
      inProgress,
      notStarted,
    },
    visibleItems,
    photos,
    updates,
  };
}
