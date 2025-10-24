export function SkeletonChart() {
  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
      role="status"
      aria-label="読み込み中"
    >
      {/* Chart title */}
      <div className="h-5 bg-white/20 rounded w-32 mb-6"></div>

      {/* Chart bars */}
      <div className="flex items-end justify-between gap-2 h-48">
        {Array.from({ length: 7 }).map((_, index) => {
          const heights = ['h-24', 'h-32', 'h-28', 'h-36', 'h-20', 'h-40', 'h-30'];
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className={`w-full ${heights[index]} bg-white/20 rounded-t-lg`}></div>
              <div className="h-3 bg-white/20 rounded w-8"></div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-3 bg-white/20 rounded w-8"></div>
        ))}
      </div>
    </div>
  );
}
