/**
 * Unit tests — edge cases untuk semua helper functions di helpers.ts
 *
 * Setiap describe block menguji satu fungsi dengan kasus-kasus batas (boundary)
 * dan kondisi khusus yang tidak mudah ditangkap oleh property-based tests.
 *
 * @see src/features/dashboard/helpers.ts
 * @see src/features/dashboard/__tests__/helpers.property.test.ts
 */

import { describe, it, expect } from "vitest";
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
// getGreetingLabel
// ---------------------------------------------------------------------------

describe("getGreetingLabel", () => {
  it("jam 5 (batas bawah pagi) → Selamat pagi", () => {
    expect(getGreetingLabel(5)).toBe("Selamat pagi");
  });

  it("jam 11 (batas atas pagi) → Selamat pagi", () => {
    expect(getGreetingLabel(11)).toBe("Selamat pagi");
  });

  it("jam 12 (batas bawah siang) → Selamat siang", () => {
    expect(getGreetingLabel(12)).toBe("Selamat siang");
  });

  it("jam 14 (batas atas siang) → Selamat siang", () => {
    expect(getGreetingLabel(14)).toBe("Selamat siang");
  });

  it("jam 15 (batas bawah sore) → Selamat sore", () => {
    expect(getGreetingLabel(15)).toBe("Selamat sore");
  });

  it("jam 17 (batas atas sore) → Selamat sore", () => {
    expect(getGreetingLabel(17)).toBe("Selamat sore");
  });

  it("jam 0 (tengah malam) → Selamat malam", () => {
    expect(getGreetingLabel(0)).toBe("Selamat malam");
  });

  it("jam 4 (batas atas malam dini hari) → Selamat malam", () => {
    expect(getGreetingLabel(4)).toBe("Selamat malam");
  });

  it("jam 18 (batas bawah malam) → Selamat malam", () => {
    expect(getGreetingLabel(18)).toBe("Selamat malam");
  });

  it("jam 23 (batas atas malam) → Selamat malam", () => {
    expect(getGreetingLabel(23)).toBe("Selamat malam");
  });
});

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

describe("formatRelativeTime", () => {
  // Waktu referensi tetap agar test deterministik
  const now = new Date("2024-06-15T10:00:00.000Z");

  const makeDate = (diffMs: number) => new Date(now.getTime() - diffMs);

  const SEC = 1000;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  it("selisih 0 detik → baru saja", () => {
    expect(formatRelativeTime(makeDate(0), now)).toBe("baru saja");
  });

  it("selisih 30 detik → baru saja", () => {
    expect(formatRelativeTime(makeDate(30 * SEC), now)).toBe("baru saja");
  });

  it("selisih 59 detik → baru saja", () => {
    expect(formatRelativeTime(makeDate(59 * SEC), now)).toBe("baru saja");
  });

  it("selisih tepat 1 menit → 1 menit lalu", () => {
    expect(formatRelativeTime(makeDate(1 * MIN), now)).toBe("1 menit lalu");
  });

  it("selisih 59 menit → 59 menit lalu", () => {
    expect(formatRelativeTime(makeDate(59 * MIN), now)).toBe("59 menit lalu");
  });

  it("selisih tepat 1 jam → 1 jam lalu", () => {
    expect(formatRelativeTime(makeDate(1 * HOUR), now)).toBe("1 jam lalu");
  });

  it("selisih 23 jam 59 menit → 23 jam lalu", () => {
    expect(formatRelativeTime(makeDate(23 * HOUR + 59 * MIN), now)).toBe(
      "23 jam lalu"
    );
  });

  it("selisih tepat 24 jam → kemarin", () => {
    expect(formatRelativeTime(makeDate(24 * HOUR), now)).toBe("kemarin");
  });

  it("selisih 47 jam 59 menit → kemarin", () => {
    expect(formatRelativeTime(makeDate(47 * HOUR + 59 * MIN), now)).toBe(
      "kemarin"
    );
  });

  it("selisih tepat 48 jam → 2 hari lalu", () => {
    expect(formatRelativeTime(makeDate(48 * HOUR), now)).toBe("2 hari lalu");
  });

  it("selisih 6 hari 23 jam → 6 hari lalu", () => {
    expect(formatRelativeTime(makeDate(6 * DAY + 23 * HOUR), now)).toBe(
      "6 hari lalu"
    );
  });

  it("selisih tepat 7 hari → format DD MMM YYYY", () => {
    // now = 2024-06-15T10:00:00Z, minus 7 hari = 2024-06-08T10:00:00Z
    // WIB = UTC+7, jadi 2024-06-08T17:00:00 WIB → tanggal 08 Jun 2024
    const result = formatRelativeTime(makeDate(7 * DAY), now);
    expect(result).toBe("08 Jun 2024");
  });

  it("selisih 8 hari → format DD MMM YYYY", () => {
    // now = 2024-06-15T10:00:00Z, minus 8 hari = 2024-06-07T10:00:00Z
    // WIB = 2024-06-07T17:00:00 WIB → tanggal 07 Jun 2024
    const result = formatRelativeTime(makeDate(8 * DAY), now);
    expect(result).toBe("07 Jun 2024");
  });
});

// ---------------------------------------------------------------------------
// calcDaysRemaining
// ---------------------------------------------------------------------------

describe("calcDaysRemaining", () => {
  // now = 2024-06-15T05:00:00Z = 2024-06-15T12:00:00 WIB (siang hari)
  const now = new Date("2024-06-15T05:00:00.000Z");

  it("targetDate adalah hari ini (WIB) → 0", () => {
    // 2024-06-15T00:00:00Z = 2024-06-15T07:00:00 WIB → masih tanggal 15
    const targetDate = new Date("2024-06-15T00:00:00.000Z");
    expect(calcDaysRemaining(targetDate, now)).toBe(0);
  });

  it("targetDate adalah besok (WIB) → 1", () => {
    const targetDate = new Date("2024-06-16T00:00:00.000Z");
    expect(calcDaysRemaining(targetDate, now)).toBe(1);
  });

  it("targetDate adalah kemarin (WIB) → -1", () => {
    const targetDate = new Date("2024-06-14T00:00:00.000Z");
    expect(calcDaysRemaining(targetDate, now)).toBe(-1);
  });

  it("targetDate adalah 7 hari dari sekarang → 7", () => {
    const targetDate = new Date("2024-06-22T00:00:00.000Z");
    expect(calcDaysRemaining(targetDate, now)).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// buildReminders
// ---------------------------------------------------------------------------

describe("buildReminders", () => {
  // now = 2024-06-15T05:00:00Z = 2024-06-15T12:00:00 WIB
  const now = new Date("2024-06-15T05:00:00.000Z");

  const makeProject = (
    id: string,
    status: "active" | "delayed" = "active",
    targetDate: Date | null = null
  ): RawProject => ({ id, name: `Proyek ${id}`, status, targetDate });

  it("activeProjects kosong → array kosong", () => {
    const params: BuildReminderParams = {
      activeProjects: [],
      projectsWithReportToday: new Set(),
      projectsWithPortfolio: new Set(),
      now,
    };
    expect(buildReminders(params)).toEqual([]);
  });

  it("1 proyek tanpa laporan hari ini → 1 danger reminder", () => {
    const params: BuildReminderParams = {
      activeProjects: [makeProject("p1")],
      projectsWithReportToday: new Set(),
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("danger");
  });

  it("1 proyek dengan laporan hari ini → 0 danger reminders", () => {
    const params: BuildReminderParams = {
      activeProjects: [makeProject("p1")],
      projectsWithReportToday: new Set(["p1"]),
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    expect(result.filter((r) => r.type === "danger")).toHaveLength(0);
  });

  it("1 proyek dengan targetDate 3 hari ke depan → 1 warning reminder", () => {
    // 3 hari dari now (2024-06-15) = 2024-06-18
    const targetDate = new Date("2024-06-18T00:00:00.000Z");
    const params: BuildReminderParams = {
      activeProjects: [makeProject("p1", "active", targetDate)],
      projectsWithReportToday: new Set(["p1"]), // sudah ada laporan, tidak ada danger
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("warning");
  });

  it("1 proyek dengan targetDate 8 hari ke depan → 0 warning reminders", () => {
    // 8 hari dari now (2024-06-15) = 2024-06-23
    const targetDate = new Date("2024-06-23T00:00:00.000Z");
    const params: BuildReminderParams = {
      activeProjects: [makeProject("p1", "active", targetDate)],
      projectsWithReportToday: new Set(["p1"]),
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    expect(result.filter((r) => r.type === "warning")).toHaveLength(0);
  });

  it("6 proyek semua tanpa laporan → dibatasi 5 reminders", () => {
    const projects = ["p1", "p2", "p3", "p4", "p5", "p6"].map((id) =>
      makeProject(id)
    );
    const params: BuildReminderParams = {
      activeProjects: projects,
      projectsWithReportToday: new Set(),
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    expect(result).toHaveLength(5);
  });

  it("danger reminders selalu sebelum warning reminders dalam output", () => {
    // p1: tanpa laporan (danger) + targetDate 3 hari (warning)
    // p2: dengan laporan + targetDate 2 hari (warning only)
    const targetDate3 = new Date("2024-06-18T00:00:00.000Z");
    const targetDate2 = new Date("2024-06-17T00:00:00.000Z");
    const params: BuildReminderParams = {
      activeProjects: [
        makeProject("p1", "active", targetDate3),
        makeProject("p2", "active", targetDate2),
      ],
      projectsWithReportToday: new Set(["p2"]),
      projectsWithPortfolio: new Set(),
      now,
    };
    const result = buildReminders(params);
    // Semua danger harus muncul sebelum warning
    const firstWarningIdx = result.findIndex((r) => r.type === "warning");
    const lastDangerIdx = result.map((r) => r.type).lastIndexOf("danger");
    if (firstWarningIdx !== -1 && lastDangerIdx !== -1) {
      expect(lastDangerIdx).toBeLessThan(firstWarningIdx);
    }
    // Pastikan ada setidaknya 1 danger dan 1 warning
    expect(result.some((r) => r.type === "danger")).toBe(true);
    expect(result.some((r) => r.type === "warning")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// sortActiveProjects
// ---------------------------------------------------------------------------

describe("sortActiveProjects", () => {
  const makeProject = (
    id: string,
    status: "active" | "delayed",
    targetDate: Date | null
  ): RawProject => ({ id, name: `Proyek ${id}`, status, targetDate });

  it("semua delayed → diurutkan berdasarkan targetDate asc", () => {
    const projects = [
      makeProject("p3", "delayed", new Date("2024-06-20T00:00:00Z")),
      makeProject("p1", "delayed", new Date("2024-06-10T00:00:00Z")),
      makeProject("p2", "delayed", new Date("2024-06-15T00:00:00Z")),
    ];
    const result = sortActiveProjects(projects);
    expect(result.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("semua active → diurutkan berdasarkan targetDate asc", () => {
    const projects = [
      makeProject("p3", "active", new Date("2024-07-01T00:00:00Z")),
      makeProject("p1", "active", new Date("2024-06-20T00:00:00Z")),
      makeProject("p2", "active", new Date("2024-06-25T00:00:00Z")),
    ];
    const result = sortActiveProjects(projects);
    expect(result.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("campuran delayed + active → delayed selalu lebih dulu", () => {
    const projects = [
      makeProject("a1", "active", new Date("2024-06-10T00:00:00Z")),
      makeProject("d1", "delayed", new Date("2024-06-20T00:00:00Z")),
      makeProject("a2", "active", new Date("2024-06-15T00:00:00Z")),
      makeProject("d2", "delayed", new Date("2024-06-12T00:00:00Z")),
    ];
    const result = sortActiveProjects(projects);
    const ids = result.map((p) => p.id);
    // Semua delayed harus muncul sebelum active
    const firstActiveIdx = ids.findIndex((id) => id.startsWith("a"));
    const lastDelayedIdx = ids.map((id) => id.startsWith("d")).lastIndexOf(true);
    expect(lastDelayedIdx).toBeLessThan(firstActiveIdx);
    // Delayed diurutkan asc: d2 (Jun 12) sebelum d1 (Jun 20)
    expect(ids[0]).toBe("d2");
    expect(ids[1]).toBe("d1");
  });

  it("null targetDate → ditempatkan di akhir dalam kelompoknya", () => {
    const projects = [
      makeProject("p_null", "active", null),
      makeProject("p_early", "active", new Date("2024-06-10T00:00:00Z")),
      makeProject("p_late", "active", new Date("2024-06-20T00:00:00Z")),
    ];
    const result = sortActiveProjects(projects);
    expect(result[result.length - 1].id).toBe("p_null");
  });
});

// ---------------------------------------------------------------------------
// mapActionLabel
// ---------------------------------------------------------------------------

describe("mapActionLabel", () => {
  it("project_created → Proyek baru dibuat", () => {
    expect(mapActionLabel("project_created")).toBe("Proyek baru dibuat");
  });

  it("report_submitted → Laporan harian dikirim", () => {
    expect(mapActionLabel("report_submitted")).toBe("Laporan harian dikirim");
  });

  it("photo_uploaded → Foto ditambahkan ke galeri", () => {
    expect(mapActionLabel("photo_uploaded")).toBe("Foto ditambahkan ke galeri");
  });

  it("member_added → Anggota tim ditambahkan", () => {
    expect(mapActionLabel("member_added")).toBe("Anggota tim ditambahkan");
  });

  it("status_changed → Status proyek diperbarui", () => {
    expect(mapActionLabel("status_changed")).toBe("Status proyek diperbarui");
  });

  it("material_recorded → Material dicatat", () => {
    expect(mapActionLabel("material_recorded")).toBe("Material dicatat");
  });

  it("action tidak dikenal 'custom_action' → dikembalikan apa adanya", () => {
    expect(mapActionLabel("custom_action")).toBe("custom_action");
  });

  it("string kosong → dikembalikan apa adanya", () => {
    expect(mapActionLabel("")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// isAtProjectLimit
// ---------------------------------------------------------------------------

describe("isAtProjectLimit", () => {
  // Tier: free (batas 1 proyek)
  it("free, 0 proyek → false", () => {
    expect(isAtProjectLimit(0, "free")).toBe(false);
  });

  it("free, 1 proyek → true", () => {
    expect(isAtProjectLimit(1, "free")).toBe(true);
  });

  it("free, 2 proyek → true", () => {
    expect(isAtProjectLimit(2, "free")).toBe(true);
  });

  // Tier: pro (batas 3 proyek)
  it("pro, 2 proyek → false", () => {
    expect(isAtProjectLimit(2, "pro")).toBe(false);
  });

  it("pro, 3 proyek → true", () => {
    expect(isAtProjectLimit(3, "pro")).toBe(true);
  });

  it("pro, 4 proyek → true", () => {
    expect(isAtProjectLimit(4, "pro")).toBe(true);
  });

  // Tier: business (tidak terbatas)
  it("business, 100 proyek → false", () => {
    expect(isAtProjectLimit(100, "business")).toBe(false);
  });

  // Tier tidak dikenal → diperlakukan seperti free
  it("tier tidak dikenal, 1 proyek → true (diperlakukan seperti free)", () => {
    expect(isAtProjectLimit(1, "unknown_tier")).toBe(true);
  });
});
