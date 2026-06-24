/**
 * WBS Template Definitions
 *
 * Pre-defined Work Breakdown Structure templates for common Indonesian
 * construction project types. Total weight per template = 100%.
 *
 * These are pure data — no DB interaction. Used by applyWbsTemplateAction.
 */

export type WbsTemplateItem = {
  name: string;
  category: string;
  weight: number; // percent, sum of all items = 100
  volume: string | null;
};

export type WbsTemplate = {
  key: string;
  name: string;
  description: string;
  items: WbsTemplateItem[];
};

// ─── Template 1: Rumah Tinggal ──────────────────────────────────────────────

const rumahTinggal: WbsTemplate = {
  key: "rumah-tinggal",
  name: "Rumah Tinggal",
  description: "Template umum untuk proyek pembangunan rumah tinggal satu atau dua lantai.",
  items: [
    {
      name: "Pekerjaan Persiapan & Pembersihan Lahan",
      category: "Persiapan",
      weight: 5,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Pondasi",
      category: "Pondasi",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan Struktur (Kolom, Balok, Plat)",
      category: "Struktur",
      weight: 20,
      volume: null,
    },
    {
      name: "Pekerjaan Dinding & Pasangan Bata",
      category: "Dinding",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan Atap & Rangka Atap",
      category: "Atap",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)",
      category: "MEP",
      weight: 10,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Finishing (Plester, Cat, Keramik)",
      category: "Finishing",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan Luar & Landscaping",
      category: "Lainnya",
      weight: 5,
      volume: "1 ls",
    },
  ],
};

// ─── Template 2: Gedung Komersial / Kantor ───────────────────────────────────

const gedungKomersial: WbsTemplate = {
  key: "gedung-komersial",
  name: "Gedung Komersial / Kantor",
  description: "Template untuk proyek gedung berlantai banyak: kantor, ruko, atau fasilitas komersial.",
  items: [
    {
      name: "Pekerjaan Persiapan, Mobilisasi & Direksi Keet",
      category: "Persiapan",
      weight: 5,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Tanah & Galian",
      category: "Pondasi",
      weight: 8,
      volume: null,
    },
    {
      name: "Pekerjaan Pondasi (Tiang Pancang / Bored Pile)",
      category: "Pondasi",
      weight: 12,
      volume: null,
    },
    {
      name: "Pekerjaan Struktur Beton Bertulang",
      category: "Struktur",
      weight: 25,
      volume: null,
    },
    {
      name: "Pekerjaan Dinding & Fasad",
      category: "Dinding",
      weight: 12,
      volume: null,
    },
    {
      name: "Pekerjaan Atap & Waterproofing",
      category: "Atap",
      weight: 8,
      volume: null,
    },
    {
      name: "Pekerjaan MEP (Listrik, HVAC, Plumbing, Fire System)",
      category: "MEP",
      weight: 15,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Finishing Interior & Eksterior",
      category: "Finishing",
      weight: 15,
      volume: null,
    },
  ],
};

// ─── Template 3: Renovasi Interior ──────────────────────────────────────────

const renovasiInterior: WbsTemplate = {
  key: "renovasi-interior",
  name: "Renovasi Interior",
  description: "Template untuk proyek renovasi interior ruangan: kantor, rumah, apartemen, atau ruko.",
  items: [
    {
      name: "Pekerjaan Persiapan & Proteksi Area Kerja",
      category: "Persiapan",
      weight: 5,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Pembongkaran (Bongkar Lama)",
      category: "Persiapan",
      weight: 10,
      volume: null,
    },
    {
      name: "Pekerjaan Partisi, Gypsum & Dinding",
      category: "Dinding",
      weight: 25,
      volume: null,
    },
    {
      name: "Pekerjaan MEP (Elektrikal, Plumbing, AC)",
      category: "MEP",
      weight: 25,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Finishing (Lantai, Ceiling, Cat, Furniture Built-in)",
      category: "Finishing",
      weight: 35,
      volume: null,
    },
  ],
};

// ─── Template 4: Infrastruktur Jalan ────────────────────────────────────────

const infrastrukturJalan: WbsTemplate = {
  key: "infrastruktur-jalan",
  name: "Infrastruktur Jalan",
  description: "Template untuk proyek pembangunan atau perbaikan jalan lingkungan dan drainase.",
  items: [
    {
      name: "Pekerjaan Persiapan & Mobilisasi",
      category: "Persiapan",
      weight: 5,
      volume: "1 ls",
    },
    {
      name: "Pekerjaan Tanah & Galian",
      category: "Pondasi",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan Subbase & Base Course",
      category: "Struktur",
      weight: 20,
      volume: null,
    },
    {
      name: "Pekerjaan Perkerasan (Aspal / Beton)",
      category: "Struktur",
      weight: 35,
      volume: null,
    },
    {
      name: "Pekerjaan Drainase & Gorong-gorong",
      category: "MEP",
      weight: 15,
      volume: null,
    },
    {
      name: "Pekerjaan Marka, Rambu & Finishing",
      category: "Finishing",
      weight: 10,
      volume: "1 ls",
    },
  ],
};

// ─── Exported registry ───────────────────────────────────────────────────────

export const WBS_TEMPLATES: WbsTemplate[] = [
  rumahTinggal,
  gedungKomersial,
  renovasiInterior,
  infrastrukturJalan,
];

export function getWbsTemplateByKey(key: string): WbsTemplate | undefined {
  return WBS_TEMPLATES.find((t) => t.key === key);
}
