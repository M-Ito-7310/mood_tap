export function SkeletonCalendar() {
  const daysInWeek = 7;
  const weeksToShow = 5;

  return (
    <div className="space-y-6" role="status" aria-label="読み込み中">
      {/* Month header skeleton */}
      <div className="flex items-center justify-between px-4 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
        </div>
      </div>

      {/* Weekday headers skeleton */}
      <div className="grid grid-cols-7 gap-2 px-4">
        {Array.from({ length: daysInWeek }).map((_, index) => (
          <div
            key={`weekday-${index}`}
            className="h-8 bg-white/10 rounded animate-pulse"
          ></div>
        ))}
      </div>

      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7 gap-2 px-4">
        {Array.from({ length: daysInWeek * weeksToShow }).map((_, index) => (
          <div
            key={`day-${index}`}
            className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
