import { notFound } from "next/navigation";
import { type ProjectTab, formatDate } from "./mock-data";
import { ProjectDetailContent } from "./project-detail-content";
import { requireRole } from "@/lib/auth/session";
import { getProjectById } from "@/features/projects/projects-service";
import { calcDaysRemaining } from "@/features/dashboard/helpers";
import { getWbsByProjectId } from "@/features/wbs/wbs-service";
import { getReportsByProjectId } from "@/features/reports/reports-service";
import { getTeamMembersByProjectId } from "@/features/team/team-service";
import { getMaterialsInByProjectId, getMaterialUsagesByProjectId } from "@/features/materials/materials-service";
import { getPhotosByProjectId } from "@/features/photos/photos-service";

type ProjectPageSearchParams = {
  tab?: string;
  modal?: string;
};

function normalizeTab(tab?: string): ProjectTab {
  if (
    tab === "wbs" ||
    tab === "reports" ||
    tab === "photos" ||
    tab === "team" ||
    tab === "materials" ||
    tab === "settings"
  ) {
    return tab;
  }

  return "wbs";
}

export async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<ProjectPageSearchParams>;
}) {
  const user = await requireRole("contractor");
  const { id } = await params;
  const query = await searchParams;
  
  const rawProject = await getProjectById(id, user.id);

  if (!rawProject) {
    notFound();
  }

  const [wbsRecords, reportRecords, teamRecords, materialsInRecords, materialsUsageRecords, photoRecords] = await Promise.all([
    getWbsByProjectId(id),
    getReportsByProjectId(id),
    getTeamMembersByProjectId(id),
    getMaterialsInByProjectId(id),
    getMaterialUsagesByProjectId(id),
    getPhotosByProjectId(id),
  ]);

  const now = new Date();
  const daysRemaining = rawProject.targetDate 
    ? calcDaysRemaining(new Date(`${rawProject.targetDate}T00:00:00Z`), now)
    : 0;

  // Map to the shape expected by ProjectDetailContent
  const project = {
    id: rawProject.id,
    name: rawProject.name,
    type: rawProject.type,
    owner: rawProject.ownerName,
    location: rawProject.location,
    status: rawProject.status as any,
    progress: rawProject.progress,
    startDate: rawProject.createdAt.toISOString().split("T")[0],
    targetDate: rawProject.targetDate || "-",
    daysRemaining,
    contractValue: rawProject.contractValue,
    photoCount: 0,
    reportCount: reportRecords.length,
    trackingEnabled: rawProject.isOwnerTrackingEnabled,
    portfolioPublished: false,
    allowOwnerReview: false,
    wbs: wbsRecords.map(w => ({
      id: w.id,
      name: w.name,
      category: w.category,
      weight: w.weight,
      volume: w.volume || "-",
      progress: w.progress,
      status: w.status,
      assignee: w.assignee || "-",
      updatedAt: formatDate(w.updatedAt),
      level: w.parentId ? 2 : 1,
    })),
    reports: reportRecords.map(r => ({
      id: r.id,
      date: r.reportDate,
      weather: r.weather || "-",
      issue: r.hasIssue,
      updatedItems: r.updatedItemsCount,
      photos: r.photosCount,
      author: "Admin", // Should be user's name but we only have authorId
      note: r.notes || "-",
    })),
    photos: photoRecords.map((p, i) => ({
      id: p.id,
      url: p.url,
      angle: p.angle || `Foto ${i + 1}`,
      item: p.wbsItemName || "General",
      uploadedAt: formatDate(p.createdAt),
      uploader: p.uploaderName || "Admin",
    })),
    team: teamRecords.map(t => ({
      id: t.id,
      name: t.name,
      initials: t.name.slice(0, 2).toUpperCase(),
      role: t.role,
      status: t.isActive ? "Aktif" : "Nonaktif",
      reportsSubmitted: 0,
      activities: [],
    })),
    materialsIn: materialsInRecords.map(m => ({
      id: m.id,
      date: m.date,
      name: m.name,
      quantity: m.quantity,
      supplier: m.supplier || "-",
      recordedBy: m.recordedBy || "Admin",
    })),
    materialsUsage: materialsUsageRecords.map(m => ({
      id: m.id,
      date: m.date,
      item: m.wbsItemName || "General",
      material: m.materialName,
      quantity: m.quantity,
      note: m.note || "-",
    })),
    activities: [],
  };

  return (
    <ProjectDetailContent
      project={project as any}
      tab={normalizeTab(query.tab)}
      showPdfModal={query.modal === "pdf"}
    />
  );
}
