/**
 * Bug Condition Exploration Test — Task 1
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1**
 *
 * Property 1: Bug Condition — Definisi Duplikat di Luar Canonical Source
 *
 * CRITICAL: Test ini HARUS FAIL pada kode unfixed.
 * Kegagalan membuktikan bug ada.
 *
 * Test ini mengenkode EXPECTED BEHAVIOR (post-fix) — sehingga:
 * - FAIL pada unfixed code = bug terkonfirmasi ✓
 * - PASS setelah fix = bug terselesaikan ✓
 *
 * Pendekatan: Static analysis — baca konten file dan assert kondisi yang
 * seharusnya benar setelah fix. Pada kode unfixed, kondisi ini belum terpenuhi.
 */

import * as fs from "fs";
import * as path from "path";
import { describe, it, expect } from "vitest";

const ROOT = path.resolve(__dirname, "../../");

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(ROOT, relativePath));
}

// ---------------------------------------------------------------------------
// Bug 1 — cn() Duplication
// Expected behavior (post-fix): src/lib/ui/cn.ts harus re-export dari utils.ts,
// BUKAN mendefinisikan cn secara independen.
// Pada kode unfixed: cn.ts mendefinisikan cn sendiri → test FAIL
// ---------------------------------------------------------------------------
describe("Bug 1 — cn() duplication in src/lib/ui/cn.ts", () => {
  it("src/lib/ui/cn.ts should be a re-export from @/lib/utils, not an independent definition", () => {
    const cnContent = readFile("src/lib/ui/cn.ts");

    // Post-fix: file harus mengandung re-export dari utils
    expect(cnContent).toContain('export { cn } from "@/lib/utils"');

    // Post-fix: file TIDAK boleh mendefinisikan fungsi cn sendiri
    expect(cnContent).not.toMatch(/export\s+function\s+cn\s*\(/);

    // Post-fix: file TIDAK boleh mengimpor clsx/tailwind-merge secara independen
    expect(cnContent).not.toContain('from "clsx"');
    expect(cnContent).not.toContain('from "tailwind-merge"');
  });
});

// ---------------------------------------------------------------------------
// Bug 2 — ProjectStatus enum conflict
// Expected behavior (post-fix): mock-data.ts harus menggunakan ProjectStatus
// dari canonical source (enums.ts) dengan nilai English.
// Pada kode unfixed: mock-data.ts mendefinisikan ProjectStatus dengan nilai
// Indonesian ("aktif", "tertunda", dll.) → test FAIL
// ---------------------------------------------------------------------------
describe("Bug 2 — ProjectStatus mismatch in mock-data.ts", () => {
  it("mock-data.ts should NOT export its own ProjectStatus type with Indonesian values", () => {
    const mockDataContent = readFile(
      "src/app/(app)/_components/mock-data.ts"
    );

    // Post-fix: tidak boleh ada definisi lokal ProjectStatus dengan nilai Indonesian
    expect(mockDataContent).not.toMatch(
      /export\s+type\s+ProjectStatus\s*=\s*["']aktif["']/
    );

    // Post-fix: tidak boleh ada nilai "aktif" sebagai bagian dari type union ProjectStatus
    expect(mockDataContent).not.toMatch(
      /type\s+ProjectStatus\s*=.*"aktif"/
    );
  });

  it("mock-data.ts should import ProjectStatus from canonical source @/lib/contracts/enums", () => {
    const mockDataContent = readFile(
      "src/app/(app)/_components/mock-data.ts"
    );

    // Post-fix: harus mengimpor dari canonical source
    expect(mockDataContent).toMatch(
      /import.*ProjectStatus.*from\s+["']@\/lib\/contracts\/enums["']/
    );
  });

  it("mock-data.ts project data should use canonical English status values, not Indonesian", () => {
    const mockDataContent = readFile(
      "src/app/(app)/_components/mock-data.ts"
    );

    // Post-fix: data proyek harus menggunakan nilai canonical English
    // Nilai Indonesian tidak boleh ada sebagai status value dalam data
    expect(mockDataContent).not.toMatch(/status:\s*["']aktif["']/);
    expect(mockDataContent).not.toMatch(/status:\s*["']tertunda["']/);
    expect(mockDataContent).not.toMatch(/status:\s*["']selesai["']/);
    expect(mockDataContent).not.toMatch(/status:\s*["']arsip["']/);
  });
});

// ---------------------------------------------------------------------------
// Bug 3 — Broken navigation routes
// Expected behavior (post-fix): navigation.ts harus menggunakan route yang
// benar-benar ada di filesystem.
// Pada kode unfixed: /proyek, /portofolio, /langganan, /pengaturan-akun
// ada di navigation.ts tapi tidak ada di filesystem → test FAIL
// ---------------------------------------------------------------------------
describe("Bug 3 — Broken routes in src/lib/navigation.ts", () => {
  it("navigation.ts should NOT reference /proyek (route does not exist in filesystem)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: /proyek tidak boleh ada di navigation
    expect(navContent).not.toContain('href: "/proyek"');
  });

  it("navigation.ts should NOT reference /portofolio (route does not exist in filesystem)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: /portofolio tidak boleh ada di navigation
    expect(navContent).not.toContain('href: "/portofolio"');
  });

  it("navigation.ts should NOT reference /langganan (route does not exist — correct route is /billing)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: /langganan tidak boleh ada, harus /billing
    expect(navContent).not.toContain('href: "/langganan"');
  });

  it("navigation.ts should NOT reference /pengaturan-akun (route does not exist in filesystem)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: /pengaturan-akun tidak boleh ada
    expect(navContent).not.toContain('href: "/pengaturan-akun"');
  });

  it("contractor navigation should reference /projects which exists in filesystem", () => {
    // Verifikasi /projects memang ada di filesystem
    expect(fileExists("src/app/(app)/projects")).toBe(true);

    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: harus menggunakan /projects
    expect(navContent).toContain('href: "/projects"');
  });

  it("navigation.ts should NOT reference /admin/pengguna (correct route is /admin/users)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    // Post-fix: /admin/pengguna tidak boleh ada
    expect(navContent).not.toContain('href: "/admin/pengguna"');
  });

  it("navigation.ts should NOT reference /admin/moderasi-portofolio (correct route is /admin/moderation/portfolio)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    expect(navContent).not.toContain('href: "/admin/moderasi-portofolio"');
  });

  it("navigation.ts should NOT reference /admin/moderasi-ulasan (correct route is /admin/moderation/reviews)", () => {
    const navContent = readFile("src/lib/navigation.ts");

    expect(navContent).not.toContain('href: "/admin/moderasi-ulasan"');
  });
});

// ---------------------------------------------------------------------------
// Bug 4 — URL mismatch in robots.ts
// Expected behavior (post-fix): robots.ts harus menggunakan siteConfig.url,
// bukan hardcode URL berbeda.
// Pada kode unfixed: robots.ts hardcode "https://kontraktorpro.app" sementara
// siteConfig.url = "https://kontraktorpro.local" → test FAIL
// ---------------------------------------------------------------------------
describe("Bug 4 — URL mismatch in src/app/robots.ts", () => {
  it("robots.ts should NOT hardcode a URL different from siteConfig.url", () => {
    const robotsContent = readFile("src/app/robots.ts");
    const siteContent = readFile("src/lib/site.ts");

    // Ekstrak siteConfig.url dari site.ts
    const urlMatch = siteContent.match(/url:\s*["']([^"']+)["']/);
    expect(urlMatch).not.toBeNull();
    const siteConfigUrl = urlMatch![1]; // "https://kontraktorpro.local"

    // Post-fix: robots.ts tidak boleh mengandung URL hardcoded yang berbeda
    // dari siteConfig.url
    expect(robotsContent).not.toContain("https://kontraktorpro.app");

    // Post-fix: robots.ts harus mengimpor siteConfig
    expect(robotsContent).toMatch(
      /import.*siteConfig.*from\s+["']@\/lib\/site["']/
    );

    // Post-fix: robots.ts harus menggunakan siteConfig.url (bukan hardcode)
    expect(robotsContent).toContain("siteConfig.url");

    // Verifikasi bahwa URL yang digunakan di robots.ts konsisten dengan siteConfig.url
    // (tidak ada URL lain yang hardcoded)
    expect(robotsContent).not.toMatch(
      /["']https:\/\/kontraktorpro\.app\/sitemap\.xml["']/
    );
  });

  it("siteConfig.url should be the single source of truth for the site URL", () => {
    const siteContent = readFile("src/lib/site.ts");

    // Verifikasi siteConfig.url ada dan terdefinisi
    expect(siteContent).toMatch(/url:\s*["']https?:\/\//);
  });
});
