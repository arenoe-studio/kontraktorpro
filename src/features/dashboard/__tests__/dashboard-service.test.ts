/**
 * Integration tests — dashboard-service.ts
 *
 * Menguji fungsi `getDashboardData` dengan mock Drizzle `db` instance
 * untuk menghindari koneksi DB nyata di CI.
 *
 * Strategi mock:
 * - `vi.mock("@/lib/db")` menggantikan seluruh modul db
 * - `mockDb` dibuat dengan `vi.hoisted()` agar tersedia saat factory di-hoist
 * - Setiap call ke `db.select()` mengambil data dari antrian `mockReturnQueue`
 * - Chainable builder mock mengembalikan `this` untuk setiap method, dan
 *   mengimplementasikan `then` agar bisa di-`await`
 *
 * Urutan query di getDashboardData (saat ada proyek):
 * 1. users (Step 0)
 * 2. projects (Step 1)
 * 3. daily_reports (Step 2, paralel)
 * 4. project_members (Step 2, paralel)
 * 5. portfolio_entries (Step 2, paralel)
 * 6. activity_logs (Step 2, setelah Promise.all)
 *
 * @see src/features/dashboard/dashboard-service.ts
 * @see src/features/dashboard/types.ts
 */

import { describe, it, test, expect, vi, beforeEach } from "vitest";
import fc from "fast-check";

// ---------------------------------------------------------------------------
// vi.hoisted — harus dipanggil sebelum vi.mock agar tersedia di factory
// ---------------------------------------------------------------------------

const { mockReturnQueue, mockDb } = vi.hoisted(() => {
  const mockReturnQueue: unknown[][] = [];

  /**
   * Buat chainable builder yang mengembalikan `data` saat di-await.
   * Setiap method mengembalikan `this` untuk mendukung chaining Drizzle.
   */
  function createChainableBuilder(data: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder: any = {
      from: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then(
        resolve: (value: unknown[]) => unknown,
        reject?: (reason: unknown) => unknown
      ) {
        return Promise.resolve(data).then(resolve, reject);
      },
    };
    return builder;
  }

  const mockDb = {
    select: vi.fn(() => {
      const data = mockReturnQueue.shift() ?? [];
      return createChainableBuilder(data);
    }),
  };

  return { mockReturnQueue, mockDb };
});

// ---------------------------------------------------------------------------
// Mock @/lib/db — factory menggunakan mockDb dari vi.hoisted
// ---------------------------------------------------------------------------

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

// ---------------------------------------------------------------------------
// Import setelah mock
// ---------------------------------------------------------------------------

import { getDashboardData } from "../dashboard-service";

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

const USER_ID = "user-uuid-001";

/** Buat row user mock */
function makeUserRow(overrides?: Partial<{ fullName: string; subscriptionTier: string }>) {
  return {
    fullName: overrides?.fullName ?? "Budi Santoso",
    subscriptionTier: overrides?.subscriptionTier ?? "free",
  };
}

/** Buat row project mock */
function makeProject(overrides?: Partial<{
  id: string;
  ownerId: string;
  name: string;
  type: string;
  location: string;
  ownerName: string;
  status: string;
  progress: number;
  targetDate: string | null;
  completedAt: Date | null;
}>) {
  return {
    id: overrides?.id ?? "proj-001",
    ownerId: overrides?.ownerId ?? USER_ID,
    name: overrides?.name ?? "Proyek Test",
    type: overrides?.type ?? "Gedung",
    location: overrides?.location ?? "Jakarta",
    ownerName: overrides?.ownerName ?? "PT Test",
    status: overrides?.status ?? "active",
    progress: overrides?.progress ?? 50,
    contractValue: 100_000_000,
    isOwnerTrackingEnabled: false,
    targetDate: overrides?.targetDate !== undefined ? overrides.targetDate : null,
    completedAt: overrides?.completedAt !== undefined ? overrides.completedAt : null,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };
}

/** Buat row daily_report mock */
function makeDailyReport(overrides?: Partial<{
  id: string;
  projectId: string;
  status: string;
  createdAt: Date;
}>) {
  return {
    id: overrides?.id ?? "report-001",
    projectId: overrides?.projectId ?? "proj-001",
    authorId: USER_ID,
    status: overrides?.status ?? "submitted",
    weather: "Cerah",
    notes: "Test notes",
    createdAt: overrides?.createdAt ?? new Date(),
  };
}

/** Buat row activity_log mock */
function makeActivityLog(overrides?: Partial<{
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: Date;
}>) {
  return {
    id: overrides?.id ?? "log-001",
    actorId: overrides?.actorId ?? USER_ID,
    action: overrides?.action ?? "project_created",
    targetType: overrides?.targetType ?? "project",
    targetId: overrides?.targetId ?? "proj-001",
    metadata: null,
    createdAt: overrides?.createdAt ?? new Date(),
  };
}

/** Buat row project_member mock */
function makeProjectMember(overrides?: Partial<{
  id: string;
  projectId: string;
  isActive: boolean;
}>) {
  return {
    id: overrides?.id ?? "member-001",
    projectId: overrides?.projectId ?? "proj-001",
    name: "Anggota Test",
    phone: null,
    role: "Mandor",
    isActive: overrides?.isActive !== undefined ? overrides.isActive : true,
  };
}

/** Buat row portfolio_entry mock */
function makePortfolioEntry(overrides?: Partial<{
  id: string;
  projectId: string;
  status: string;
}>) {
  return {
    id: overrides?.id ?? "portfolio-001",
    projectId: overrides?.projectId ?? "proj-001",
    userId: USER_ID,
    title: "Portfolio Test",
    status: overrides?.status ?? "pending",
    createdAt: new Date("2024-01-01T00:00:00Z"),
  };
}

/**
 * Buat chainable builder yang throw saat di-await (untuk simulasi query gagal).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createErrorBuilder(error: Error): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder: any = {
    from: () => builder,
    where: () => builder,
    orderBy: () => builder,
    limit: () => builder,
    then(
      _resolve: (value: unknown[]) => unknown,
      reject?: (reason: unknown) => unknown
    ) {
      return reject
        ? Promise.reject(error).catch(reject)
        : Promise.reject(error);
    },
  };
  return builder;
}

// ---------------------------------------------------------------------------
// Reset mock sebelum setiap test
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  mockReturnQueue.length = 0;
  // Reset select ke implementasi default (queue-based)
  mockDb.select.mockImplementation(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const builder: any = {
      from: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then(
        resolve: (value: unknown[]) => unknown,
        reject?: (reason: unknown) => unknown
      ) {
        const data = mockReturnQueue.shift() ?? [];
        return Promise.resolve(data).then(resolve, reject);
      },
    };
    return builder;
  });
});

// ---------------------------------------------------------------------------
// Test 1: User dengan proyek — returns valid DashboardSummary
// ---------------------------------------------------------------------------

describe("getDashboardData — user dengan proyek", () => {
  it("mengembalikan DashboardSummary valid dengan semua field terisi", async () => {
    const activeProject = makeProject({
      id: "proj-active",
      status: "active",
      progress: 65,
      targetDate: null,
    });
    const completedProject = makeProject({
      id: "proj-completed",
      status: "completed",
      progress: 100,
      completedAt: new Date(), // bulan ini
    });

    const reportToday = makeDailyReport({
      id: "report-today",
      projectId: "proj-active",
      status: "submitted",
      createdAt: new Date(), // hari ini
    });

    const activityLog = makeActivityLog({
      id: "log-001",
      action: "project_created",
      createdAt: new Date(),
    });

    const member = makeProjectMember({ projectId: "proj-active" });
    const portfolio = makePortfolioEntry({ projectId: "proj-completed", status: "pending" });

    // Queue: users, projects, daily_reports, project_members, portfolio_entries, activity_logs
    mockReturnQueue.push(
      [makeUserRow({ fullName: "Budi Santoso", subscriptionTier: "free" })],
      [activeProject, completedProject],
      [reportToday],
      [member],
      [portfolio],
      [activityLog]
    );

    const result = await getDashboardData(USER_ID);

    // fullName dari user row
    expect(result.fullName).toBe("Budi Santoso");

    // activeProjectCount: hanya proj-active (status active)
    expect(result.activeProjectCount).toBe(1);

    // activities adalah array
    expect(Array.isArray(result.activities)).toBe(true);

    // activityLoadError false karena query berhasil
    expect(result.activityLoadError).toBe(false);

    // isProjectLimitReached adalah boolean
    expect(typeof result.isProjectLimitReached).toBe("boolean");

    // greetingLabel adalah salah satu dari 4 label
    expect(["Selamat pagi", "Selamat siang", "Selamat sore", "Selamat malam"]).toContain(
      result.greetingLabel
    );
  });
});

// ---------------------------------------------------------------------------
// Test 2: User tanpa proyek — returns all zeros and empty arrays
// ---------------------------------------------------------------------------

describe("getDashboardData — user tanpa proyek", () => {
  it("mengembalikan semua nilai 0 dan array kosong", async () => {
    // Hanya 2 query: users + projects (early return setelah projects kosong)
    mockReturnQueue.push(
      [makeUserRow({ subscriptionTier: "free" })],
      [] // projects kosong
    );

    const result = await getDashboardData(USER_ID);

    expect(result.activeProjectCount).toBe(0);
    expect(result.pendingReportCount).toBe(0);
    expect(result.reportCompletionToday).toBe("0/0");
    expect(result.averageProgress).toBe(0);
    expect(result.finishedThisMonth).toBe(0);
    expect(result.reminders).toEqual([]);
    expect(result.activeProjects).toEqual([]);
    expect(result.activities).toEqual([]);
    expect(result.activityLoadError).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Test 3: activity_logs query gagal — activityLoadError: true, activities: []
// ---------------------------------------------------------------------------

describe("getDashboardData — activity_logs query gagal", () => {
  it("mengembalikan activityLoadError: true dan activities: [], dashboard tetap return", async () => {
    const activeProject = makeProject({ id: "proj-active", status: "active" });

    // Untuk call ke-6 (activity_logs), kembalikan error builder
    let callCount = 0;
    mockDb.select.mockImplementation(() => {
      callCount++;
      if (callCount === 6) {
        return createErrorBuilder(new Error("DB connection failed"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder: any = {
        from: () => builder,
        where: () => builder,
        orderBy: () => builder,
        limit: () => builder,
        then(
          resolve: (value: unknown[]) => unknown,
          reject?: (reason: unknown) => unknown
        ) {
          const data = mockReturnQueue.shift() ?? [];
          return Promise.resolve(data).then(resolve, reject);
        },
      };
      return builder;
    });

    mockReturnQueue.push(
      [makeUserRow()],
      [activeProject],
      [], // daily_reports
      [], // project_members
      []  // portfolio_entries
      // activity_logs akan throw (call ke-6)
    );

    // Fungsi harus resolve (tidak throw)
    const result = await getDashboardData(USER_ID);

    expect(result.activityLoadError).toBe(true);
    expect(result.activities).toEqual([]);
    // Dashboard tetap return dengan data lain
    expect(result.fullName).toBeDefined();
    expect(typeof result.activeProjectCount).toBe("number");
  });
});

// ---------------------------------------------------------------------------
// Property 2: activeProjectCount akurat untuk berbagai kombinasi status proyek
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 2: activeProjectCount akurat untuk semua kombinasi status proyek
describe("Property 2: activeProjectCount akurat untuk semua kombinasi status proyek", () => {
  test("activeProjectCount selalu sama dengan jumlah proyek berstatus active atau delayed", async () => {
    /**
     * **Validates: Requirements 2.6, 3.1**
     */

    const projectStatusArb = fc.constantFrom(
      "draft" as const,
      "active" as const,
      "delayed" as const,
      "completed" as const,
      "archived" as const
    );

    const projectsArb = fc.array(
      fc.record({
        id: fc.uuid(),
        status: projectStatusArb,
        progress: fc.integer({ min: 0, max: 100 }),
      }),
      { minLength: 0, maxLength: 10 }
    );

    await fc.assert(
      fc.asyncProperty(projectsArb, async (projectDefs) => {
        vi.clearAllMocks();
        mockReturnQueue.length = 0;

        const projectRows = projectDefs.map((def) =>
          makeProject({
            id: def.id,
            status: def.status,
            progress: def.progress,
          })
        );

        const expectedActiveCount = projectDefs.filter(
          (p) => p.status === "active" || p.status === "delayed"
        ).length;

        // Reset select ke queue-based implementation
        mockDb.select.mockImplementation(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const builder: any = {
            from: () => builder,
            where: () => builder,
            orderBy: () => builder,
            limit: () => builder,
            then(
              resolve: (value: unknown[]) => unknown,
              reject?: (reason: unknown) => unknown
            ) {
              const data = mockReturnQueue.shift() ?? [];
              return Promise.resolve(data).then(resolve, reject);
            },
          };
          return builder;
        });

        mockReturnQueue.push([makeUserRow()]);
        mockReturnQueue.push(projectRows);

        if (projectRows.length > 0) {
          mockReturnQueue.push([]); // daily_reports
          mockReturnQueue.push([]); // project_members
          mockReturnQueue.push([]); // portfolio_entries
          mockReturnQueue.push([]); // activity_logs
        }

        const result = await getDashboardData(USER_ID);

        return result.activeProjectCount === expectedActiveCount;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: reportCompletionToday selalu dalam format "X/Y"
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 3: reportCompletionToday selalu dalam format "X/Y" dengan nilai akurat
describe("Property 3: reportCompletionToday selalu dalam format 'X/Y' dengan nilai akurat", () => {
  test("format selalu X/Y di mana X <= Y, dan Y = jumlah proyek active/delayed", async () => {
    /**
     * **Validates: Requirements 3.2**
     */

    // Generator: 0–5 proyek active, beberapa dengan laporan hari ini
    const scenarioArb = fc
      .record({
        activeCount: fc.integer({ min: 0, max: 5 }),
        reportedCount: fc.integer({ min: 0, max: 5 }),
      })
      .map(({ activeCount, reportedCount }) => ({
        activeCount,
        // reportedCount tidak boleh melebihi activeCount
        reportedCount: Math.min(reportedCount, activeCount),
      }));

    await fc.assert(
      fc.asyncProperty(scenarioArb, async ({ activeCount, reportedCount }) => {
        vi.clearAllMocks();
        mockReturnQueue.length = 0;

        // Buat proyek active
        const projectRows = Array.from({ length: activeCount }, (_, i) =>
          makeProject({ id: `proj-${i}`, status: "active", progress: 50 })
        );

        // Buat laporan submitted hari ini untuk `reportedCount` proyek pertama
        const now = new Date();
        const reportRows = Array.from({ length: reportedCount }, (_, i) =>
          makeDailyReport({
            id: `report-${i}`,
            projectId: `proj-${i}`,
            status: "submitted",
            createdAt: now,
          })
        );

        mockDb.select.mockImplementation(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const builder: any = {
            from: () => builder,
            where: () => builder,
            orderBy: () => builder,
            limit: () => builder,
            then(
              resolve: (value: unknown[]) => unknown,
              reject?: (reason: unknown) => unknown
            ) {
              const data = mockReturnQueue.shift() ?? [];
              return Promise.resolve(data).then(resolve, reject);
            },
          };
          return builder;
        });

        mockReturnQueue.push([makeUserRow()]);
        mockReturnQueue.push(projectRows);

        if (projectRows.length > 0) {
          mockReturnQueue.push(reportRows); // daily_reports
          mockReturnQueue.push([]);          // project_members
          mockReturnQueue.push([]);          // portfolio_entries
          mockReturnQueue.push([]);          // activity_logs
        }

        const result = await getDashboardData(USER_ID);

        // Verifikasi format "X/Y"
        const formatMatch = /^(\d+)\/(\d+)$/.exec(result.reportCompletionToday);
        if (!formatMatch) return false;

        const x = parseInt(formatMatch[1], 10);
        const y = parseInt(formatMatch[2], 10);

        // X tidak boleh melebihi Y
        if (x > y) return false;

        // Y harus sama dengan activeCount
        if (y !== activeCount) return false;

        // X harus sama dengan reportedCount (laporan submitted hari ini)
        if (x !== reportedCount) return false;

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: averageProgress adalah rata-rata integer yang akurat
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 4: averageProgress adalah rata-rata integer yang akurat
describe("Property 4: averageProgress adalah rata-rata integer yang akurat", () => {
  test("averageProgress = Math.round(sum/count) untuk proyek active/delayed", async () => {
    /**
     * **Validates: Requirements 3.3**
     */

    const progressListArb = fc.array(fc.integer({ min: 0, max: 100 }), {
      minLength: 0,
      maxLength: 8,
    });

    await fc.assert(
      fc.asyncProperty(progressListArb, async (progressList) => {
        vi.clearAllMocks();
        mockReturnQueue.length = 0;

        const projectRows = progressList.map((progress, i) =>
          makeProject({
            id: `proj-${i}`,
            status: "active",
            progress,
          })
        );

        const expectedAverage =
          progressList.length === 0
            ? 0
            : Math.round(
                progressList.reduce((sum, p) => sum + p, 0) / progressList.length
              );

        mockDb.select.mockImplementation(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const builder: any = {
            from: () => builder,
            where: () => builder,
            orderBy: () => builder,
            limit: () => builder,
            then(
              resolve: (value: unknown[]) => unknown,
              reject?: (reason: unknown) => unknown
            ) {
              const data = mockReturnQueue.shift() ?? [];
              return Promise.resolve(data).then(resolve, reject);
            },
          };
          return builder;
        });

        mockReturnQueue.push([makeUserRow()]);
        mockReturnQueue.push(projectRows);

        if (projectRows.length > 0) {
          mockReturnQueue.push([]); // daily_reports
          mockReturnQueue.push([]); // project_members
          mockReturnQueue.push([]); // portfolio_entries
          mockReturnQueue.push([]); // activity_logs
        }

        const result = await getDashboardData(USER_ID);

        return result.averageProgress === expectedAverage;
      }),
      { numRuns: 100 }
    );
  });
});
