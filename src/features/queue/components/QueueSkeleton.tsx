export default function QueueSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />

        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-muted/40 p-3"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />

            <div className="h-4 w-10 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-5 h-4 w-48 animate-pulse rounded bg-muted" />

      <div className="mt-6 flex gap-3">
        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />

        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
