"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LayoutTemplate, CheckCircle2, X, ChevronRight } from "lucide-react";
import { applyWbsTemplateAction } from "@/features/wbs/actions";
import { WBS_TEMPLATES, type WbsTemplate } from "@/features/wbs/wbs-templates";
import { Button } from "./ui";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  projectId: string;
  /** If true, a confirmation dialog is shown before applying (replace mode). */
  hasExistingItems: boolean;
};

type ModalStep = "select" | "confirm";

// ─── Category color map ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Persiapan: "bg-slate-100 text-slate-700",
  Pondasi: "bg-amber-100 text-amber-800",
  Struktur: "bg-blue-100 text-blue-800",
  Dinding: "bg-orange-100 text-orange-700",
  Atap: "bg-sky-100 text-sky-700",
  MEP: "bg-purple-100 text-purple-700",
  Finishing: "bg-green-100 text-green-700",
  Lainnya: "bg-zinc-100 text-zinc-600",
};

function categoryBadge(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-zinc-100 text-zinc-600";
}

// ─── Template Card ───────────────────────────────────────────────────────────

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: WbsTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-150",
        selected
          ? "border-orange-500 bg-orange-50/60 shadow-sm"
          : "border-zinc-200 bg-white hover:border-orange-300 hover:bg-orange-50/30",
      ].join(" ")}
    >
      {selected && (
        <CheckCircle2 className="absolute right-4 top-4 size-5 text-orange-500" />
      )}

      <p className="pr-6 font-semibold text-zinc-900">{template.name}</p>
      <p className="mt-1 text-sm text-zinc-500">{template.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {template.items.slice(0, 5).map((item, i) => (
          <span
            key={i}
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryBadge(item.category)}`}
          >
            {item.category}
          </span>
        ))}
        {template.items.length > 5 && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
            +{template.items.length - 5} lagi
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        {template.items.length} item &middot; Total bobot 100%
      </p>
    </button>
  );
}

// ─── Main Modal Component ────────────────────────────────────────────────────

export function WbsTemplateModal({ projectId, hasExistingItems }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("select");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedTemplate = WBS_TEMPLATES.find((t) => t.key === selectedKey);

  function openModal() {
    setStep("select");
    setSelectedKey(null);
    setIsOpen(true);
  }

  function closeModal() {
    if (isPending) return;
    setIsOpen(false);
  }

  function handleNext() {
    if (!selectedKey) return;
    if (hasExistingItems) {
      // Show confirm step when existing items would be replaced
      setStep("confirm");
    } else {
      applyTemplate(false);
    }
  }

  function applyTemplate(replace: boolean) {
    if (!selectedKey) return;

    startTransition(async () => {
      const res = await applyWbsTemplateAction(projectId, selectedKey, replace);
      if (res.success) {
        toast.success("Template WBS berhasil diterapkan.");
        setIsOpen(false);
      } else {
        toast.error(res.error ?? "Gagal menerapkan template.");
      }
    });
  }

  return (
    <>
      {/* Trigger button */}
      <Button variant="outline" onClick={openModal} id="btn-gunakan-template">
        <LayoutTemplate className="size-4" />
        Gunakan Template
      </Button>

      {/* Backdrop + Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[28px] bg-white shadow-2xl">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {step === "select"
                    ? "Pilih Template WBS"
                    : "Konfirmasi Penggantian WBS"}
                </h3>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {step === "select"
                    ? "Pilih template sesuai jenis proyek Anda."
                    : "WBS yang sudah ada akan digantikan seluruhnya."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="flex size-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Tutup modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ── Body ───────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {step === "select" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {WBS_TEMPLATES.map((template) => (
                    <TemplateCard
                      key={template.key}
                      template={template}
                      selected={selectedKey === template.key}
                      onSelect={() => setSelectedKey(template.key)}
                    />
                  ))}
                </div>
              ) : (
                /* Confirmation step — show template preview */
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <p className="font-semibold text-amber-800">
                      ⚠️ Perhatian: Semua item WBS yang ada akan dihapus
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      Template <strong>&ldquo;{selectedTemplate?.name}&rdquo;</strong> akan
                      menggantikan seluruh WBS proyek ini. Tindakan ini tidak
                      dapat dibatalkan.
                    </p>
                  </div>

                  {selectedTemplate && (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-zinc-700">
                        Item yang akan ditambahkan ({selectedTemplate.items.length}):
                      </p>
                      <div className="space-y-2">
                        {selectedTemplate.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <ChevronRight className="size-4 text-zinc-400" />
                              <span className="font-medium text-zinc-800">
                                {item.name}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryBadge(item.category)}`}
                              >
                                {item.category}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-zinc-500">
                              {item.weight}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4">
              {step === "select" ? (
                <>
                  <Button variant="ghost" onClick={closeModal} disabled={isPending}>
                    Batal
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedKey || isPending}
                  >
                    {hasExistingItems ? "Lanjut →" : "Terapkan Template"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("select")}
                    disabled={isPending}
                  >
                    ← Kembali
                  </Button>
                  <Button
                    onClick={() => applyTemplate(true)}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isPending ? "Menerapkan..." : "Ya, Ganti WBS"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
