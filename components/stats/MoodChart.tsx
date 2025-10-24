'use client';

import { getWeeklyData } from '@/lib/stats';
import { MoodEntry, MOOD_COLOR } from '@/types/mood';
import { useMemo } from 'react';

interface MoodChartProps {
  entries: MoodEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  const weekData = useMemo(() => getWeeklyData(entries), [entries]);

  const maxScore = 5;
  const chartHeight = 200;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">今週の気分推移</h3>

      <div className="relative" style={{ height: chartHeight }}>
        {/* Y軸ラベル */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          {[5, 4, 3, 2, 1].map((score) => (
            <div key={score}>{score}</div>
          ))}
        </div>

        {/* グラフエリア */}
        <div className="ml-8 h-full border-l-2 border-b-2 border-gray-300 relative">
          {/* グリッド線 */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-full border-t border-gray-200"
              style={{ top: `${(i / 5) * 100}%` }}
            />
          ))}

          {/* データポイントとライン */}
          <svg className="absolute inset-0 w-full h-full">
            {/* 折れ線 */}
            <polyline
              points={weekData
                .map((day, index) => {
                  if (day.moodScore === null) return null;
                  const x = ((index + 0.5) / 7) * 100;
                  const y = 100 - (day.moodScore / maxScore) * 100;
                  return `${x}%,${y}%`;
                })
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* データポイント */}
            {weekData.map((day, index) => {
              if (day.moodScore === null) return null;

              const x = ((index + 0.5) / 7) * 100;
              const y = 100 - (day.moodScore / maxScore) * 100;

              return (
                <circle
                  key={day.date}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="6"
                  fill={day.entry ? MOOD_COLOR[day.entry.moodLabel] : '#9CA3AF'}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* X軸ラベル */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-around text-xs text-gray-500">
            {weekData.map((day) => (
              <div key={day.date} className="text-center">
                {day.dayLabel}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
