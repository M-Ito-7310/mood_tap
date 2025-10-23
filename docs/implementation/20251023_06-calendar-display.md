# Phase 6: カレンダー表示機能

**作成日**: 2025年10月23日
**Phase**: 6/12
**所要時間**: 90-120分
**前提条件**: Phase 1-5完了

---

## Phase概要

### 目的
月次カレンダーで気分記録をヒートマップ形式で可視化。日付クリックで詳細表示を実現。

### 成果物
- `components/calendar/MoodCalendar.tsx`: カレンダーコンポーネント
- `components/calendar/CalendarDay.tsx`: 日付セル
- `app/calendar/page.tsx`: カレンダーページ
- ヒートマップカラーリング

---

## 実装タスク詳細

### タスク1: CalendarDayコンポーネント (30分)

#### ファイル: `components/calendar/CalendarDay.tsx`

```typescript
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

export function CalendarDay({ date, entry, isToday, isCurrentMonth, onClick }: CalendarDayProps) {
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
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={cn('text-sm font-medium', isToday && 'text-blue-600')}>
          {dayNumber}
        </span>
        {entry && (
          <span className="text-xl mt-1">{MOOD_ICON[entry.moodLabel]}</span>
        )}
      </div>
    </button>
  );
}
```

### タスク2: MoodCalendarコンポーネント (50分)

#### ファイル: `components/calendar/MoodCalendar.tsx`

```typescript
'use client';

import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { CalendarDay } from './CalendarDay';
import { MoodEntry } from '@/types/mood';

export function MoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { entries } = useMoodEntries();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 月の最初の日の曜日を取得 (0=日曜)
  const firstDayOfWeek = monthStart.getDay();

  // カレンダーグリッド用の空白セル
  const emptyDays = Array(firstDayOfWeek).fill(null);

  // 日付から記録を取得
  const getEntryForDate = (date: Date): MoodEntry | null => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entries.find((entry) => entry.date === dateString) || null;
  };

  // 月の変更
  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  // 日付クリック (Phase 7でメモ編集に使用)
  const handleDayClick = (date: Date) => {
    console.log('Clicked date:', date);
    // TODO: Phase 7で詳細モーダル実装
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
        >
          ←
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h2>
          <button
            onClick={handleToday}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            今月へ戻る
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
        >
          →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {/* 空白セル */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* 日付セル */}
        {days.map((day) => {
          const entry = getEntryForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonthDay = isSameMonth(day, currentMonth);

          return (
            <CalendarDay
              key={day.toString()}
              date={day}
              entry={entry}
              isToday={isToday}
              isCurrentMonth={isCurrentMonthDay}
              onClick={() => handleDayClick(day)}
            />
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 p-4 bg-white rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">カラー凡例</h3>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
            <span>最悪</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FB923C' }} />
            <span>悪い</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }} />
            <span>普通</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60A5FA' }} />
            <span>良い</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }} />
            <span>最高</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### タスク3: カレンダーページ (10分)

#### ファイル: `app/calendar/page.tsx`

```typescript
import { CalendarClient } from './CalendarClient';

export default function CalendarPage() {
  return <CalendarClient />;
}
```

#### ファイル: `app/calendar/CalendarClient.tsx`

```typescript
'use client';

import { MoodCalendar } from '@/components/calendar/MoodCalendar';

export function CalendarClient() {
  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">カレンダー</h1>
          <p className="text-gray-600 mt-2">あなたの気分の波を可視化</p>
        </header>

        <section className="card">
          <MoodCalendar />
        </section>
      </div>
    </div>
  );
}
```

---

## チェックリスト

- [ ] 月次カレンダーが表示される
- [ ] 気分記録がヒートマップで可視化される
- [ ] 前月/次月ボタンが動作する
- [ ] 今日の日付がハイライトされる
- [ ] レスポンシブデザインが機能する

---

## 次のPhaseへの接続

Phase 7でメモ機能を追加し、日付クリックで詳細編集を可能にします。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
