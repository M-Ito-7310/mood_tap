'use client';

import { MoodEntry, MOOD_COLOR, MOOD_ICON } from '@/types/mood';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  entry: MoodEntry | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export function CalendarDay({
  date,
  entry,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const dayNumber = date.getDate();

  return (
    <button
      onClick={onClick}
      className={cn(
        'aspect-square p-2 rounded-lg transition-all',
        'hover:scale-105 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        !isCurrentMonth && 'opacity-30',
        isToday && 'ring-2 ring-blue-600'
      )}
      style={{
        backgroundColor: entry ? MOOD_COLOR[entry.moodLabel] + '40' : '#F3F4F6',
      }}
      aria-label={`${date.toLocaleDateString('ja-JP')}${entry ? ` - ${entry.moodLabel}` : ''}`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={cn('text-sm font-medium', isToday && 'text-blue-600')}>
          {dayNumber}
        </span>
        {entry && (
          <span className="text-xl mt-1" role="img" aria-label={entry.moodLabel}>
            {MOOD_ICON[entry.moodLabel]}
          </span>
        )}
      </div>
    </button>
  );
}
