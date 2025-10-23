# Phase 8: 統計・可視化機能

**作成日**: 2025年10月23日
**Phase**: 8/12
**所要時間**: 60-90分
**前提条件**: Phase 1-7完了

---

## Phase概要

### 目的
週次/月次の統計データを算出し、折れ線グラフで可視化。ストリーク(連続記録日数)表示を実装。

### 成果物
- `components/stats/MoodChart.tsx`: 折れ線グラフ
- `components/stats/StreakDisplay.tsx`: ストリーク表示
- `lib/stats.ts`: 統計計算関数
- `app/stats/page.tsx`: 統計ページ

---

## 実装タスク詳細

### タスク1: 統計計算関数 (20分)

#### ファイル: `lib/stats.ts`

```typescript
import { MoodEntry } from '@/types/mood';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, differenceInDays } from 'date-fns';

/**
 * 平均気分スコアを計算
 */
export function calculateAverageMood(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, entry) => acc + entry.moodScore, 0);
  return Math.round((sum / entries.length) * 10) / 10; // 小数点1桁
}

/**
 * 週次データを計算
 */
export function getWeeklyData(entries: MoodEntry[], targetDate: Date = new Date()) {
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // 月曜始まり
  const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return daysInWeek.map((day) => {
    const dayString = format(day, 'yyyy-MM-dd');
    const entry = entries.find((e) => e.date === dayString);

    return {
      date: dayString,
      dayLabel: format(day, 'E', { locale: require('date-fns/locale/ja') }),
      moodScore: entry?.moodScore || null,
      entry,
    };
  });
}

/**
 * 連続記録日数(ストリーク)を計算
 */
export function calculateStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  // 日付降順でソート
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  let streak = 0;
  let currentDate = new Date();

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const daysDiff = differenceInDays(currentDate, entryDate);

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      // 連続が途切れた
      break;
    }
  }

  return streak;
}

/**
 * 最高/最低気分スコアを取得
 */
export function getMoodExtremes(entries: MoodEntry[]) {
  if (entries.length === 0) {
    return { highest: null, lowest: null };
  }

  const scores = entries.map((e) => e.moodScore);
  return {
    highest: Math.max(...scores),
    lowest: Math.min(...scores),
  };
}
```

### タスク2: StreakDisplayコンポーネント (15分)

#### ファイル: `components/stats/StreakDisplay.tsx`

```typescript
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
```

### タスク3: MoodChartコンポーネント (35分)

#### ファイル: `components/stats/MoodChart.tsx`

```typescript
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
```

### タスク4: 統計ページ (20分)

#### ファイル: `app/stats/page.tsx`

```typescript
import { StatsClient } from './StatsClient';

export default function StatsPage() {
  return <StatsClient />;
}
```

#### ファイル: `app/stats/StatsClient.tsx`

```typescript
'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MoodChart } from '@/components/stats/MoodChart';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { calculateAverageMood, getMoodExtremes } from '@/lib/stats';
import { MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';

export function StatsClient() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  const avgMood = calculateAverageMood(entries);
  const { highest, lowest } = getMoodExtremes(entries);

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">統計</h1>
          <p className="text-gray-600 mt-2">あなたの気分データを分析</p>
        </header>

        <div className="space-y-6">
          {/* サマリーカード */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-gray-600 mb-2">総記録数</p>
              <p className="text-4xl font-bold text-blue-600">{entries.length}</p>
            </div>

            <div className="card text-center">
              <p className="text-gray-600 mb-2">平均気分</p>
              <p className="text-4xl font-bold text-green-600">{avgMood.toFixed(1)}</p>
            </div>

            <StreakDisplay entries={entries} />
          </div>

          {/* グラフ */}
          <MoodChart entries={entries} />

          {/* その他統計 */}
          {highest !== null && lowest !== null && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">気分の範囲</h3>
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">最高</p>
                  <p className="text-3xl font-bold text-blue-600">{highest}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">最低</p>
                  <p className="text-3xl font-bold text-red-600">{lowest}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## チェックリスト

- [ ] 週次グラフが表示される
- [ ] ストリークが正しく計算される
- [ ] 統計数値が正確に表示される
- [ ] レスポンシブデザインが機能する

---

## 次のPhaseへの接続

Phase 9でPWA対応を実装します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
