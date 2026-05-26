/**
 * Property-based tests — helpers.ts
 *
 * Menggunakan fast-check untuk memverifikasi properti universal yang harus
 * berlaku untuk semua input valid, bukan hanya contoh spesifik.
 *
 * Setiap property diberi komentar tag sesuai konvensi spec:
 * // Feature: dashboard-real-data, Property N: <deskripsi>
 *
 * @see src/features/dashboard/helpers.ts
 * @see src/features/dashboard/__tests__/helpers.unit.test.ts
 */

import { describe, test, expect } from "vitest";
import fc from "fast-check";
import {
  getGreetingLabel,
  formatRelativeTime,
  calcDaysRemaining,
  buildReminders,
  sortActiveProjects,
  mapActionLabel,
  isAtProjectLimit,
  type RawProject,
  type BuildReminderParams,
} from "../helpers";

// ---------------------------------------------------------------------------
// Konstanta & helpers lokal
// ---------------------------------------------------------------------------

const REMINDER_PRIORITY: Record<string, number> = {
  danger: 0,
  warning: 1,
  success: 2,
  info: 3,
};

/** Buat RawProject dari nilai primitif. */
function makeRawProject(
  id: string,
  status: "active" | "delayed",
  targetDate: Date | null
): RawProject {
  return { id, name: `Proyek ${id}`, status, targetDate };
}

// ---------------------------------------------------------------------------
// Property 1: Greeting label selalu sesuai range jam WIB
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 1: greeting label sesuai range jam WIB
describe("Property 1: greeting label selalu sesuai range jam WIB", () => {
  test("getGreetingLabel mengembalikan label yang tepat untuk setiap jam 0–23", () => {
    /**
     * **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
     */
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const label = getGreetingLabel(hour);
        if (hour >= 5 && hour <= 11) return label === "Selamat pagi";
        if (hour >= 12 && hour <= 14) return label === "Selamat siang";
        if (hour >= 15 && hour <= 17) return label === "Selamat sore";
        // 0–4 dan 18–23
        return label === "Selamat malam";
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Reminder diurutkan dengan prioritas danger → warning → success → info
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 7: reminder diurutkan dengan prioritas danger → warning → success → info
describe("Property 7: reminder diurutkan dengan prioritas danger → warning → success → info", () => {
  test("buildReminders selalu mengembalikan array yang terurut berdasarkan prioritas", () => {
    /**
     * **Validates: Requirements 4.4**
     */

    // Generator: array 0–10 proyek dengan status dan targetDate acak
    const projectArb = fc
      .record({
        id: fc.uuid(),
        status: fc.constantFrom("active" as const, "delayed" as const),
        // targetDate: null atau tanggal dalam rentang -30 hingga +30 hari dari epoch
        targetDate: fc.option(
          fc.date({ min: new Date(0), max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }),
          { nil: null }
        ),
      })
      .map(({ id, status, targetDate }) => makeRawProject(id, status, targetDate));

    const projectsArb = fc.array(projectArb, { minLength: 0, maxLength: 10 });

    fc.assert(
      fc.property(projectsArb, (projects) => {
        // Buat set ID yang sudah punya laporan (acak: setengah dari proyek)
        const withReport = new Set(
          projects.filter((_, i) => i % 2 === 0).map((p) => p.id)
        );
        const withPortfolio = new Set<string>();
        const now = new Date("2024-06-15T05:00:00.000Z");

        const params: BuildReminderParams = {
          activeProjects: projects,
          projectsWithReportToday: withReport,
          projectsWithPortfolio: withPortfolio,
          now,
        };

        const reminders = buildReminders(params);

        // Verifikasi urutan: prioritas tidak pernah menurun
        for (let i = 0; i < reminders.length - 1; i++) {
          const currentPriority = REMINDER_PRIORITY[reminders[i].type] ?? 99;
          const nextPriority = REMINDER_PRIORITY[reminders[i + 1].type] ?? 99;
          if (currentPriority > nextPriority) return false;
        }

        // Tidak ada warning sebelum danger
        const firstWarningIdx = reminders.findIndex((r) => r.type === "warning");
        const lastDangerIdx = reminders.map((r) => r.type).lastIndexOf("danger");
        if (firstWarningIdx !== -1 && lastDangerIdx !== -1) {
          if (lastDangerIdx > firstWarningIdx) return false;
        }

        // Tidak ada success sebelum warning
        const firstSuccessIdx = reminders.findIndex((r) => r.type === "success");
        const lastWarningIdx = reminders.map((r) => r.type).lastIndexOf("warning");
        if (firstSuccessIdx !== -1 && lastWarningIdx !== -1) {
          if (lastWarningIdx > firstSuccessIdx) return false;
        }

        return true;
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Jumlah reminder tidak pernah melebihi 5
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 8: jumlah reminder tidak pernah melebihi 5
describe("Property 8: jumlah reminder tidak pernah melebihi 5", () => {
  test("buildReminders selalu mengembalikan array dengan panjang ≤ 5", () => {
    /**
     * **Validates: Requirements 4.5**
     */

    // Generator: 0–20 proyek dengan targetDate acak (bisa null)
    const projectArb = fc
      .record({
        id: fc.uuid(),
        status: fc.constantFrom("active" as const, "delayed" as const),
        targetDate: fc.option(
          fc.date({
            min: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }),
          { nil: null }
        ),
      })
      .map(({ id, status, targetDate }) => makeRawProject(id, status, targetDate));

    const projectsArb = fc.array(projectArb, { minLength: 0, maxLength: 20 });

    fc.assert(
      fc.property(projectsArb, (projects) => {
        // Worst case: tidak ada laporan hari ini, tidak ada portfolio
        const params: BuildReminderParams = {
          activeProjects: projects,
          projectsWithReportToday: new Set<string>(),
          projectsWithPortfolio: new Set<string>(),
          now: new Date("2024-06-15T05:00:00.000Z"),
        };

        const reminders = buildReminders(params);
        return reminders.length <= 5;
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: activeProjects hanya berisi active/delayed, urutan urgensi, maksimal 5
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 9: activeProjects hanya berisi active/delayed, urutan urgensi, maksimal 5
describe("Property 9: sortActiveProjects + slice(0,5) memenuhi semua invariant", () => {
  test("delayed selalu sebelum active, active diurutkan targetDate asc (null di akhir), panjang ≤ 5", () => {
    /**
     * **Validates: Requirements 5.1, 5.2, 5.3**
     */

    const projectArb = fc
      .record({
        id: fc.uuid(),
        status: fc.constantFrom("active" as const, "delayed" as const),
        targetDate: fc.option(
          fc.date({
            min: new Date("2020-01-01"),
            max: new Date("2030-12-31"),
          }),
          { nil: null }
        ),
      })
      .map(({ id, status, targetDate }) => makeRawProject(id, status, targetDate));

    const projectsArb = fc.array(projectArb, { minLength: 0, maxLength: 20 });

    fc.assert(
      fc.property(projectsArb, (projects) => {
        const result = sortActiveProjects(projects).slice(0, 5);

        // (a) Semua item harus berstatus active atau delayed
        for (const p of result) {
          if (p.status !== "active" && p.status !== "delayed") return false;
        }

        // (b) Panjang tidak melebihi 5
        if (result.length > 5) return false;

        // (c) Delayed selalu sebelum active
        let seenActive = false;
        for (const p of result) {
          if (p.status === "active") {
            seenActive = true;
          } else if (p.status === "delayed" && seenActive) {
            // delayed muncul setelah active — pelanggaran
            return false;
          }
        }

        // (d) Di antara proyek active: diurutkan targetDate asc, null di akhir
        const activeProjects = result.filter((p) => p.status === "active");
        for (let i = 0; i < activeProjects.length - 1; i++) {
          const a = activeProjects[i];
          const b = activeProjects[i + 1];
          if (a.targetDate === null && b.targetDate !== null) {
            // null sebelum non-null — pelanggaran (null harus di akhir)
            return false;
          }
          if (a.targetDate !== null && b.targetDate !== null) {
            if (a.targetDate.getTime() > b.targetDate.getTime()) return false;
          }
        }

        // (e) Di antara proyek delayed: diurutkan targetDate asc, null di akhir
        const delayedProjects = result.filter((p) => p.status === "delayed");
        for (let i = 0; i < delayedProjects.length - 1; i++) {
          const a = delayedProjects[i];
          const b = delayedProjects[i + 1];
          if (a.targetDate === null && b.targetDate !== null) {
            return false;
          }
          if (a.targetDate !== null && b.targetDate !== null) {
            if (a.targetDate.getTime() > b.targetDate.getTime()) return false;
          }
        }

        return true;
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10: daysRemaining null jika dan hanya jika targetDate null
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 10: daysRemaining null jika dan hanya jika targetDate null
describe("Property 10: daysRemaining null jika dan hanya jika targetDate null", () => {
  test("calcDaysRemaining dengan targetDate non-null selalu mengembalikan number", () => {
    /**
     * **Validates: Requirements 5.5**
     *
     * calcDaysRemaining hanya menerima Date (non-null). Properti ini memverifikasi
     * bahwa untuk setiap targetDate non-null, fungsi selalu mengembalikan number
     * (bukan NaN, undefined, atau null).
     */
    const now = new Date("2024-06-15T05:00:00.000Z");

    fc.assert(
      fc.property(
        fc.date({ min: new Date("2020-01-01"), max: new Date("2030-12-31") }),
        (targetDate) => {
          const result = calcDaysRemaining(targetDate, now);
          // Harus berupa number yang valid (bukan NaN)
          return typeof result === "number" && !isNaN(result);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11: Format waktu relatif selalu sesuai breakpoint
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 11: format waktu relatif selalu sesuai breakpoint
describe("Property 11: format waktu relatif selalu sesuai breakpoint", () => {
  test("formatRelativeTime mengembalikan string yang sesuai breakpoint untuk semua selisih waktu", () => {
    /**
     * **Validates: Requirements 6.5**
     */

    const ONE_MINUTE_MS = 60 * 1000;
    const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
    const ONE_DAY_MS = 24 * ONE_HOUR_MS;

    // Generator: now tetap, date = now - diffMs (diffMs ≥ 0)
    // Gunakan integer untuk diffMs agar deterministik dan menghindari floating point
    const diffMsArb = fc.integer({ min: 0, max: 30 * 24 * 60 * 60 * 1000 }); // 0 hingga 30 hari

    const now = new Date("2024-06-15T10:00:00.000Z");

    fc.assert(
      fc.property(diffMsArb, (diffMs) => {
        const date = new Date(now.getTime() - diffMs);
        const result = formatRelativeTime(date, now);

        // Pastikan tidak pernah mengembalikan string kosong
        if (result === "") return false;

        if (diffMs < ONE_MINUTE_MS) {
          return result === "baru saja";
        }

        if (diffMs < ONE_HOUR_MS) {
          const minutes = Math.floor(diffMs / ONE_MINUTE_MS);
          return result === `${minutes} menit lalu`;
        }

        if (diffMs < ONE_DAY_MS) {
          const hours = Math.floor(diffMs / ONE_HOUR_MS);
          return result === `${hours} jam lalu`;
        }

        if (diffMs < 2 * ONE_DAY_MS) {
          return result === "kemarin";
        }

        if (diffMs < 7 * ONE_DAY_MS) {
          const days = Math.floor(diffMs / ONE_DAY_MS);
          return result === `${days} hari lalu`;
        }

        // ≥ 7 hari: format "DD MMM YYYY"
        // Verifikasi format dengan regex: dua digit spasi tiga huruf spasi empat digit
        return /^\d{2} [A-Za-z]{3} \d{4}$/.test(result);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 12: mapActionLabel mengembalikan label Indonesia untuk action dikenal,
//              action asli untuk yang tidak dikenal
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 12: mapActionLabel mengembalikan label Indonesia untuk action dikenal, action asli untuk yang tidak dikenal
describe("Property 12: mapActionLabel — label Indonesia untuk action dikenal, action asli untuk yang tidak dikenal", () => {
  const KNOWN_ACTIONS: Record<string, string> = {
    project_created: "Proyek baru dibuat",
    report_submitted: "Laporan harian dikirim",
    photo_uploaded: "Foto ditambahkan ke galeri",
    member_added: "Anggota tim ditambahkan",
    status_changed: "Status proyek diperbarui",
    material_recorded: "Material dicatat",
  };

  test("action yang dikenal selalu mengembalikan label Indonesia yang tepat", () => {
    /**
     * **Validates: Requirements 6.3**
     */
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(KNOWN_ACTIONS)), (action) => {
        return mapActionLabel(action) === KNOWN_ACTIONS[action];
      })
    );
  });

  test("action yang tidak dikenal selalu dikembalikan apa adanya (tidak diubah)", () => {
    /**
     * **Validates: Requirements 6.3**
     */

    // Generator: string yang bukan salah satu dari 6 action yang dikenal
    const unknownActionArb = fc
      .string()
      .filter((s) => !(s in KNOWN_ACTIONS));

    fc.assert(
      fc.property(unknownActionArb, (action) => {
        return mapActionLabel(action) === action;
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Property 13: isAtProjectLimit akurat untuk semua kombinasi tier dan jumlah proyek
// ---------------------------------------------------------------------------

// Feature: dashboard-real-data, Property 13: isAtProjectLimit akurat untuk semua kombinasi tier dan jumlah proyek
describe("Property 13: isAtProjectLimit akurat untuk semua kombinasi tier dan jumlah proyek", () => {
  test("free: true iff count >= 1; pro: true iff count >= 3; business: selalu false", () => {
    /**
     * **Validates: Requirements 10.2, 10.3, 10.4**
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.constantFrom("free" as const, "pro" as const, "business" as const),
        (count, tier) => {
          const result = isAtProjectLimit(count, tier);

          if (tier === "free") return result === count >= 1;
          if (tier === "pro") return result === count >= 3;
          if (tier === "business") return result === false;

          return true; // tidak akan tercapai
        }
      )
    );
  });
});
