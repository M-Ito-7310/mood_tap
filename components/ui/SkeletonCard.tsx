interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'stat';
}

export function SkeletonCard({ className = '', variant = 'default' }: SkeletonCardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse ${className}`}
      role="status"
      aria-label="読み込み中"
    >
      {variant === 'stat' ? (
        <>
          <div className="h-4 bg-white/20 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-white/20 rounded w-3/4"></div>
        </>
      ) : (
        <>
          <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-5/6"></div>
        </>
      )}
    </div>
  );
}
