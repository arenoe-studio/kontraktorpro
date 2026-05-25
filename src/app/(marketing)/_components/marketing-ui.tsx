"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  contractors,
  directorySortOptions,
  navigationLinks,
  pricingPlans,
  type ContractorProfile,
  type PlanName,
} from "./content";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 lg:py-20", className)}>
      {children}
    </section>
  );
}

export function badgeTone(tone: "primary" | "accent" | "info" | "success" | "warning" | "neutral") {
  return {
    primary: "bg-slate-100 text-slate-800",
    accent: "bg-orange-100 text-orange-700",
    info: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    neutral: "bg-neutral-200 text-neutral-700",
  }[tone];
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "info" | "success" | "warning" | "neutral";
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", badgeTone(tone))}>
      {children}
    </span>
  );
}

export function buttonClasses(variant: "primary" | "secondary" | "outline" | "ghost", size: "md" | "lg" | "xl" = "md") {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800";
  const variants = {
    primary: "bg-orange-500 px-5 text-white shadow-sm hover:bg-orange-600",
    secondary: "bg-slate-800 px-5 text-white hover:bg-slate-700",
    outline: "border border-slate-800 px-5 text-slate-800 hover:bg-slate-50",
    ghost: "px-1 text-slate-800 hover:text-orange-600",
  };
  const sizes = {
    md: "text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-7 py-4 text-lg",
  };
  return cn(base, variants[variant], sizes[size]);
}

export function MarketingNavbar({ minimal = false }: { minimal?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-white/95 backdrop-blur",
        scrolled && "border-slate-200 shadow-[0_2px_8px_rgba(27,58,92,0.12)]",
      )}
    >
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10">
            <Image src="/logo-only.png" alt="KontraktorPro" width={32} height={32} priority className="h-8 w-8" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">KontraktorPro</p>
            <p className="text-xs text-slate-500">Untuk kontraktor Indonesia</p>
          </div>
        </Link>

        {!minimal ? (
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            {navigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="hidden items-center gap-3 md:flex">
          {!minimal ? (
            <Link href="/masuk" className={buttonClasses("outline")}>
              Masuk
            </Link>
          ) : null}
          <Link href="/daftar" className={buttonClasses("primary")}>
            Daftar Gratis
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/daftar" className={cn(buttonClasses("primary"), "px-4 text-sm")}>
            Daftar Gratis
          </Link>
          {!minimal ? (
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Buka menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : null}
        </div>
      </Container>

      {!minimal && open ? (
        <Container className="border-t border-slate-100 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm text-slate-600">
            {navigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                {item.label}
              </Link>
            ))}
            <Link href="/masuk" className="rounded-lg px-2 py-2 hover:bg-slate-50">
              Masuk
            </Link>
          </nav>
        </Container>
      ) : null}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-900">
              <Image src="/logo-only.png" alt="KontraktorPro" width={32} height={32} priority className="h-8 w-8" />
            </div>
            <div>
              <p className="font-semibold text-white">KontraktorPro</p>
              <p className="text-xs text-slate-400">Alat kerja rapi untuk proyek nyata</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Dibuat untuk membantu kontraktor Indonesia tampil lebih profesional di lapangan dan di depan owner.</p>
        </div>
        <FooterColumn title="Produk" links={["Fitur", "Harga", "Roadmap", "Changelog"]} />
        <FooterColumn title="Perusahaan" links={["Tentang", "Blog", "Karir", "Kontak"]} />
        <FooterColumn title="Dukungan" links={["Pusat Bantuan", "Tutorial", "Syarat & Ketentuan", "Kebijakan Privasi"]} />
      </Container>
      <Container className="flex flex-col gap-2 border-t border-slate-800 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 KontraktorPro. Semua hak dilindungi.</p>
        <p>Dibuat dengan ❤️ untuk kontraktor Indonesia</p>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-white">{title}</h3>
      <ul className="space-y-3 text-sm text-slate-400">
        {links.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
    </div>
  );
}

export function MinimalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-3 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-slate-700">Powered by KontraktorPro</p>
        <div className="flex gap-5">
          <span>Syarat & Ketentuan</span>
          <span>Kebijakan Privasi</span>
        </div>
      </Container>
    </footer>
  );
}

export function PricingToggle({
  initialBilling = "monthly",
}: {
  initialBilling?: "monthly" | "yearly";
}) {
  const [billing, setBilling] = useState<"monthly" | "yearly">(initialBilling);
  const orderedPlans = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [...pricingPlans].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return pricingPlans;
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold",
              billing === "monthly" ? "bg-slate-800 text-white" : "text-slate-600",
            )}
            onClick={() => setBilling("monthly")}
          >
            Bulanan
          </button>
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold",
              billing === "yearly" ? "bg-slate-800 text-white" : "text-slate-600",
            )}
            onClick={() => setBilling("yearly")}
          >
            Tahunan
          </button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {orderedPlans.map((plan) => {
          const price = billing === "yearly" && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice;
          return (
            <article
              key={plan.name}
              className={cn(
                "rounded-[24px] border bg-white p-6 shadow-sm",
                plan.featured ? "border-orange-500 shadow-lg lg:scale-[1.03]" : "border-slate-200",
              )}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                  </div>
                  {plan.featured ? <Badge tone="accent">Paling Populer</Badge> : null}
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <span className="font-mono text-5xl font-bold tracking-tight text-slate-900">{price}</span>
                    <span className="pb-2 text-sm text-slate-500">{plan.name === "Gratis" ? "/ selamanya" : "/ bulan"}</span>
                  </div>
                  {billing === "yearly" && plan.yearlyPrice ? <p className="mt-2 text-xs text-orange-600">Hemat 20% dengan tagihan tahunan</p> : null}
                </div>
                <ul className="space-y-3 pt-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/daftar" className={buttonClasses(plan.featured ? "primary" : "outline", "lg") + " w-full"}>
                  {plan.cta}
                </Link>
                {plan.note ? <p className="text-xs text-slate-500">{plan.note}</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <button type="button" className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpenIndex(open ? null : index)}>
              <span className="font-semibold text-slate-900">{item.question}</span>
              {open ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
            </button>
            {open ? <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

export function DirectoryFilters({
  city,
  specialty,
  query,
  sort,
}: {
  city: string;
  specialty: string;
  query: string;
  sort: string;
}) {
  const cities = [...new Set(contractors.map((contractor) => contractor.city))].filter(Boolean);
  const specialties = [...new Set(contractors.flatMap((contractor) => contractor.specialties))];

  return (
    <form className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" action="/direktori">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Cari nama kontraktor atau nama usaha..."
          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-800"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <select name="city" defaultValue={city} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700">
          <option value="">Semua Kota</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          name="specialty"
          defaultValue={specialty}
          className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700"
        >
          <option value="">Semua Spesialisasi</option>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700">
          {directorySortOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonClasses("primary")}>
          Terapkan Filter
        </button>
        <Link href="/direktori" className={buttonClasses("ghost")}>
          Reset Filter
        </Link>
      </div>
    </form>
  );
}

export function ContractorDirectoryCard({ contractor }: { contractor: ContractorProfile }) {
  const tierTone = contractor.packageTier === "Bisnis" ? "accent" : contractor.packageTier === "Pro" ? "primary" : "neutral";

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-800">
          {contractor.businessName
            .split(" ")
            .slice(0, 2)
            .map((chunk) => chunk[0])
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{contractor.businessName}</h3>
            {contractor.packageTier !== "Gratis" ? <Badge tone={tierTone}>{contractor.packageTier}</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">{contractor.ownerName}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{contractor.city}</span>
            <span>•</span>
            <span>{contractor.completedProjects} proyek selesai</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-700">
        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
        <span className="font-semibold">{contractor.rating.toFixed(1)}</span>
        <span className="text-slate-500">({contractor.reviewCount} ulasan)</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {contractor.specialties.slice(0, 3).map((specialty) => (
          <Badge key={specialty}>{specialty}</Badge>
        ))}
        {contractor.specialties.length > 3 ? <Badge>+{contractor.specialties.length - 3} lagi</Badge> : null}
      </div>

      <Link href={`/kontraktor/${contractor.slug}`} className={buttonClasses("outline", "lg") + " mt-6 w-full"}>
        Lihat Profil
      </Link>
    </article>
  );
}

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {Array.from({ length: totalPages }, (_, index) => (
        <Link
          key={index + 1}
          href={`${basePath}${index === 0 ? "" : `?page=${index + 1}`}`}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold",
            page === index + 1 ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50",
          )}
        >
          {index + 1}
        </Link>
      ))}
    </div>
  );
}

export function PlanComparisonBadge({ plan }: { plan: PlanName }) {
  const tone = plan === "Pro" ? "primary" : plan === "Bisnis" ? "accent" : "neutral";
  return <Badge tone={tone}>{plan}</Badge>;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
        <Search className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-800">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={buttonClasses("ghost") + " mt-6"}>
          {actionLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
