export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Image */}
      <div className="relative h-52 animate-pulse bg-muted">
        <div className="absolute left-4 top-4 h-6 w-20 rounded-full bg-background/70" />

        <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/70" />
      </div>

      {/* Body */}
      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />

          <div className="h-7 w-24 animate-pulse rounded bg-muted" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />

            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />

            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-5 py-4">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-6 w-11 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
