export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-3xl bg-zinc-200" />
      <div className="h-32 animate-pulse rounded-3xl bg-zinc-200" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-52 animate-pulse rounded-3xl bg-zinc-200" />
      ))}
    </div>
  );
}
