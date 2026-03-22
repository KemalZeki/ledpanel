export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-light/50 border border-white/5 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-8 pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
