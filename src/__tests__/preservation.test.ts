/**
 * Preservation Property Tests — Task 2
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * Property 2: Preservation — Semua Halaman dan Flow yang Ada Tetap Berjalan
 *
 * IMPORTANT: Test ini mengenkode BASELINE BEHAVIOR yang harus dipreservasi.
 * - PASS pada unfixed code = baseline terkonfirmasi ✓
 * - PASS setelah fix = tidak ada regresi ✓
 *
 * Observation-first methodology:
 * - Observed: getProjects() mengembalikan 4 proyek dengan semua field lengkap
 * - Observed: getStatusLabel() mengembalikan label Indonesian non-empty untuk setiap status valid
 * - Observed: getStatusBadgeVariant() mengembalikan badge variant string yang valid
 * - Observed: src/lib/ui/cn.ts mengekspor fungsi cn
 * - Observed: formatCurrency(285000000) menghasilkan string yang mengandung "285"
 *
 * NOTE: Status label tests ditulis agar survive migration dari Indonesian ke English values.
 * Test memverifikasi bahwa SETIAP status valid menghasilkan label Indonesian non-empty,
 * tanpa hardcode input value spesifik ("aktif" vs "active").
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { describe, it, expect } from "vitest";
import {
  getProjects,
  getStatusLabel,
  getStatusBadgeVariant,
  formatCurrency,
  type Project,
} from "../app/(app)/_components/mock-data";

const ROOT = path.resolve(__dirname, "../../");

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(ROOT, relativePath));
}

// ---------------------------------------------------------------------------
// Preservation 1 — Mock Data Integrity
// getProjects() harus mengembalikan 4 proyek dengan semua field lengkap.
// Ini memastikan data mock tidak rusak setelah fix apapun.
// ---------------------------------------------------------------------------
describe("Preservation 1 — Mock data integrity", () => {
  it("getProjects() returns exactly 4 projects", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(4);
  });

  it("each project has all required fields", () => {
    const projects = getProjects();
    const requiredFields: Array<keyof Project> = [
      "id",
      "name",
      "status",
      "progress",
      "contractValue",
      "targetDate",
    ];

    for (const project of projects) {
      for (const field of requiredFields) {
        expect(
          project[field],
          `Project "${project.id}" is missing field "${field}"`
        ).toBeDefined();
      }
    }
  });

  it("each project has a non-empty id and name", () => {
    const projects = getProjects();
    for (const project of projects) {
      expect(project.id).toBeTruthy();
      expect(project.name).toBeTruthy();
    }
  });

  it("each project has a numeric progress between 0 and 100", () => {
    const projects = getProjects();
    for (const project of projects) {
      expect(typeof project.progress).toBe("number");
      expect(project.progress).toBeGreaterThanOrEqual(0);
      expect(project.progress).toBeLessThanOrEqual(100);
    }
  });

  it("each project has a positive contractValue", () => {
    const projects = getProjects();
    for (const project of projects) {
      expect(typeof project.contractValue).toBe("number");
      expect(project.contractValue).toBeGreaterThan(0);
    }
  });

  it("each project has a non-empty status", () => {
    const projects = getProjects();
    for (const project of projects) {
      expect(project.status).toBeTruthy();
      expect(typeof project.status).toBe("string");
    }
  });
});

// ---------------------------------------------------------------------------
// Preservation 2 — Status Label Functions
// getStatusLabel() harus mengembalikan label Indonesian non-empty untuk setiap
// status yang ada di data proyek.
//
// MIGRATION-SAFE: Test ini mengambil status values dari data aktual (getProjects()),
// bukan hardcode "aktif" atau "active". Ini memastikan test tetap valid setelah
// Fix 2 (ProjectStatus migration dari Indonesian ke English values).
// ---------------------------------------------------------------------------
describe("Preservation 2 — Status label functions", () => {
  it("getStatusLabel() returns a non-empty Indonesian string for every status in project data", () => {
    const projects = getProjects();
    const uniqueStatuses = [...new Set(projects.map((p) => p.status))];

    // Pastikan ada setidaknya satu status untuk ditest
    expect(uniqueStatuses.length).toBeGreaterThan(0);

    for (const status of uniqueStatuses) {
      const label = getStatusLabel(status);
      expect(label, `getStatusLabel("${status}") should return non-empty string`).toBeTruthy();
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("getStatusLabel() returns recognizable Indonesian labels (not raw enum values)", () => {
    const projects = getProjects();
    const uniqueStatuses = [...new Set(projects.map((p) => p.status))];

    // Label yang valid dalam Indonesian
    const validIndonesianLabels = ["Aktif", "Tertunda", "Selesai", "Arsip", "Draft"];

    for (const status of uniqueStatuses) {
      const label = getStatusLabel(status);
      expect(
        validIndonesianLabels,
        `getStatusLabel("${status}") returned "${label}" which is not a recognized Indonesian label`
      ).toContain(label);
    }
  });

  it("getStatusBadgeVariant() returns a valid badge variant string for every status in project data", () => {
    const projects = getProjects();
    const uniqueStatuses = [...new Set(projects.map((p) => p.status))];

    const validVariants = ["success", "warning", "info", "neutral", "danger", "default"];

    for (const status of uniqueStatuses) {
      const variant = getStatusBadgeVariant(status);
      expect(variant, `getStatusBadgeVariant("${status}") should return non-empty string`).toBeTruthy();
      expect(typeof variant).toBe("string");
      expect(
        validVariants,
        `getStatusBadgeVariant("${status}") returned "${variant}" which is not a valid badge variant`
      ).toContain(variant);
    }
  });
});

// ---------------------------------------------------------------------------
// Preservation 3 — formatCurrency
// formatCurrency() harus menghasilkan string yang mengandung angka yang benar.
// Ini memastikan formatter tidak rusak setelah Fix 5 (hapus duplikasi).
// ---------------------------------------------------------------------------
describe("Preservation 3 — formatCurrency", () => {
  it("formatCurrency(285000000) returns a string containing '285'", () => {
    const result = formatCurrency(285000000);
    expect(typeof result).toBe("string");
    expect(result).toContain("285");
  });

  it("formatCurrency returns a non-empty string for any positive number", () => {
    const testValues = [1000, 50000, 285000000, 935000000];
    for (const value of testValues) {
      const result = formatCurrency(value);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    }
  });

  it("formatCurrency output contains IDR currency indicator", () => {
    const result = formatCurrency(285000000);
    // Indonesian IDR format uses "Rp" prefix
    expect(result).toMatch(/Rp/i);
  });
});

// ---------------------------------------------------------------------------
// Preservation 4 — cn import resolution
// src/lib/ui/cn.ts harus mengekspor fungsi cn (apapun implementasinya).
// Ini memastikan semua komponen yang mengimpor cn dari @/lib/ui/cn tetap berjalan
// setelah Fix 1 (konsolidasi cn).
// ---------------------------------------------------------------------------
describe("Preservation 4 — cn import resolution from @/lib/ui/cn", () => {
  it("src/lib/ui/cn.ts file exists", () => {
    expect(fileExists("src/lib/ui/cn.ts")).toBe(true);
  });

  it("src/lib/ui/cn.ts exports a cn function (regardless of implementation)", () => {
    const cnContent = readFile("src/lib/ui/cn.ts");

    // File harus mengekspor cn — baik sebagai definisi maupun re-export
    const exportsCn =
      cnContent.includes("export function cn") ||
      cnContent.includes("export { cn }") ||
      cnContent.includes("export { cn,") ||
      cnContent.includes("export const cn");

    expect(exportsCn).toBe(true);
  });

  it("src/lib/utils.ts exports a cn function (canonical source)", () => {
    const utilsContent = readFile("src/lib/utils.ts");
    expect(utilsContent).toContain("export function cn");
  });
});

// ---------------------------------------------------------------------------
// Preservation 5 — TypeScript compilation baseline
// Verifikasi bahwa TypeScript compilation pass pada kode unfixed.
// Ini adalah baseline yang harus dipertahankan setelah setiap fix.
//
// NOTE: Test ini menggunakan child_process untuk menjalankan tsc --noEmit.
// Jika tsc tidak tersedia atau ada error, test akan gagal dengan pesan yang jelas.
// ---------------------------------------------------------------------------
describe("Preservation 5 — TypeScript compilation baseline", () => {
  it("tsc --noEmit passes without errors on current codebase", () => {
    let tscOutput = "";
    let tscExitCode = 0;

    try {
      tscOutput = execSync("npx tsc --noEmit", {
        cwd: ROOT,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 60000, // 60 second timeout
      });
    } catch (error: unknown) {
      const execError = error as { status?: number; stdout?: string; stderr?: string; message?: string };
      tscExitCode = execError.status ?? 1;
      tscOutput = (execError.stdout ?? "") + (execError.stderr ?? "");
    }

    expect(
      tscExitCode,
      `tsc --noEmit failed with exit code ${tscExitCode}.\nOutput:\n${tscOutput}`
    ).toBe(0);
  }, 90000); // 90 second test timeout
});
