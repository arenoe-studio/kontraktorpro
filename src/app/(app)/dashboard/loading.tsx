export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-44 animate-pulse rounded-3xl bg-zinc-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-3xl bg-zinc-200" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <div className="h-[420px] animate-pulse rounded-3xl bg-zinc-200" />
        <div className="h-[420px] animate-pulse rounded-3xl bg-zinc-200" />
      </div>
    </div>
  );
}
