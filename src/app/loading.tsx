export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary-100)] border-t-[var(--color-primary-800)]" />
        <p className="text-sm font-medium text-[var(--color-neutral-500)]">
          Menyiapkan workspace KontraktorPro...
        </p>
      </div>
    </main>
  );
}
