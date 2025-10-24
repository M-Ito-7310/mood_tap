'use client';

import { calculateStreak } from '@/lib/stats';
import { MoodEntry } from '@/types/mood';

interface StreakDisplayProps {
  entries: MoodEntry[];
}

export function StreakDisplay({ entries }: StreakDisplayProps) {
  const streak = calculateStreak(entries);

  return (
    <div className="card text-center">
      <div className="text-6xl mb-4">🔥</div>
      <div className="text-5xl font-bold text-orange-600 mb-2">{streak}</div>
      <p className="text-gray-600">連続記録日数</p>
      {streak > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          素晴らしい! このまま続けましょう!
        </p>
      )}
    </div>
  );
}
