interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 3, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="読み込み中">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 bg-white/20 rounded w-24"></div>
            <div className="h-5 bg-white/20 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
