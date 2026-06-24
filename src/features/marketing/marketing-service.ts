import { db } from "@/lib/db";
import { contractorProfiles, users, projects, contractorReviews, projectPhotos } from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface DirectoryFilter {
  query?: string;
  city?: string;
  specialty?: string;
  sort?: string;
}

export async function getPublicContractors(filter: DirectoryFilter) {
  const queryBuilder = db
    .select({
      profile: contractorProfiles,
      user: users,
    })
    .from(contractorProfiles)
    .innerJoin(users, eq(contractorProfiles.userId, users.id))
    .where(eq(users.suspended, false));

  // We fetch all active users and filter/sort in memory to simplify complex multi-table sort logic.
  // In production with millions of rows, we should push this to SQL.
  const results = await queryBuilder;

  // Let's also fetch all reviews to calculate rating accurately if needed, 
  // but contractorProfiles.rating is cached and can be used for sorting.

  let mapped = results.map(row => ({
    slug: row.profile.slug,
    businessName: row.user.businessName,
    ownerName: row.user.fullName,
    city: row.user.city,
    experienceYears: new Date().getFullYear() - row.user.createdAt.getFullYear(), // simple heuristic
    completedProjects: row.profile.verifiedProjects,
    packageTier: (row.user.subscriptionTier === "business" ? "Bisnis" : row.user.subscriptionTier === "pro" ? "Pro" : "Gratis") as "Bisnis" | "Pro" | "Gratis",
    rating: row.profile.rating,
    reviewCount: 0, // Mocked for now, can be aggregated from contractorReviews
    specialties: row.profile.specialties || [],
    about: row.profile.about || "",
    phoneVisible: row.profile.phoneVisible,
    whatsappNumber: row.user.phone || "",
    active: !row.user.suspended,
    since: row.user.createdAt.getFullYear().toString(),
    hero: row.profile.heroImage || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80",
    portfolio: [],
    reviews: [],
  }));

  if (filter.query) {
    const q = filter.query.toLowerCase();
    mapped = mapped.filter(
      c => c.businessName.toLowerCase().includes(q) || c.ownerName.toLowerCase().includes(q)
    );
  }

  if (filter.city) {
    mapped = mapped.filter(c => c.city === filter.city);
  }

  if (filter.specialty) {
    mapped = mapped.filter(c => c.specialties.includes(filter.specialty as string));
  }

  const getTierRank = (tier: string) => {
    if (tier === "Bisnis") return 3;
    if (tier === "Pro") return 2;
    return 1;
  };

  // Sort
  if (filter.sort === "Proyek Terbanyak") {
    mapped.sort((a, b) => b.completedProjects - a.completedProjects || getTierRank(b.packageTier) - getTierRank(a.packageTier));
  } else if (filter.sort === "Terbaru Bergabung") {
    mapped.sort((a, b) => Number(b.since) - Number(a.since) || getTierRank(b.packageTier) - getTierRank(a.packageTier));
  } else {
    // Default: Rating Tertinggi
    mapped.sort((a, b) => b.rating - a.rating || getTierRank(b.packageTier) - getTierRank(a.packageTier));
  }

  return mapped;
}

export async function getPublicContractorBySlug(slug: string) {
  const result = await db
    .select({
      profile: contractorProfiles,
      user: users,
    })
    .from(contractorProfiles)
    .innerJoin(users, eq(contractorProfiles.userId, users.id))
    .where(and(eq(contractorProfiles.slug, slug), eq(users.suspended, false)))
    .limit(1);

  if (result.length === 0) return null;

  const { profile, user } = result[0];

  // count reviews
  const reviews = await db
    .select()
    .from(contractorReviews)
    .where(and(eq(contractorReviews.contractorId, profile.id), eq(contractorReviews.status, "approved")));

  return {
    id: profile.id,
    userId: user.id,
    slug: profile.slug,
    businessName: user.businessName,
    ownerName: user.fullName,
    city: user.city,
    experienceYears: new Date().getFullYear() - user.createdAt.getFullYear(),
    completedProjects: profile.verifiedProjects,
    packageTier: (user.subscriptionTier === "business" ? "Bisnis" : user.subscriptionTier === "pro" ? "Pro" : "Gratis") as "Bisnis" | "Pro" | "Gratis",
    rating: profile.rating,
    reviewCount: reviews.length,
    specialties: profile.specialties || [],
    about: profile.about || "",
    phoneVisible: profile.phoneVisible,
    whatsappNumber: user.phone || "",
    active: !user.suspended,
    since: user.createdAt.getFullYear().toString(),
    hero: profile.heroImage || "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80",
  };
}

export async function getContractorPortfolio(userId: string) {
  const completedProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.ownerId, userId), eq(projects.status, "completed")))
    .orderBy(desc(projects.completedAt));

  return completedProjects.map(p => ({
    title: p.name,
    type: p.type,
    location: p.location,
    duration: p.completedAt && p.targetDate ? "Selesai" : "Selesai",
    coverLabel: p.type,
    year: p.completedAt ? p.completedAt.getFullYear().toString() : new Date().getFullYear().toString(),
    summary: "Proyek " + p.type + " di " + p.location + " dengan nilai kontrak Rp" + p.contractValue.toLocaleString("id-ID"),
    rating: 5, // mock for now, actual would be derived from reviews if related to a project
  }));
}

export async function getContractorReviews(contractorId: string) {
  const reviews = await db
    .select()
    .from(contractorReviews)
    .where(and(eq(contractorReviews.contractorId, contractorId), eq(contractorReviews.status, "approved")))
    .orderBy(desc(contractorReviews.createdAt));

  return reviews.map(r => ({
    ownerMasked: r.reviewerName,
    rating: r.rating,
    body: r.comment || "",
    date: r.createdAt.toISOString().split("T")[0],
    projectName: "Proyek Klien", // mock for now, actual would need join with projects if reviews are tied to projects
    year: r.createdAt.getFullYear().toString(),
  }));
}
