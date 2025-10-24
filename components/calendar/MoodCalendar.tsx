'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isWithinInterval,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { CalendarDay } from './CalendarDay';
import { DateRangeSelector, type DateRangePreset } from './DateRangeSelector';
import { MoodDetailModal } from '@/components/mood/MoodDetailModal';
import { MoodEntry, MOOD_COLOR, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { generateUUID, getNowISO } from '@/lib/utils';
import { SkeletonCalendar } from '@/components/ui/SkeletonCalendar';

interface DateRange {
  start: Date;
  end: Date;
}

export function MoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('this-month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { entries, saveEntry, deleteEntry, isLoading } = useMoodEntries();

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

  // 日付クリック - 詳細モーダルを開く
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // 選択された日付のエントリーを取得
  const getSelectedEntry = (): MoodEntry | null => {
    if (!selectedDate) return null;
    return getEntryForDate(selectedDate);
  };

  // モーダル保存処理
  const handleModalSave = async (updates: Partial<MoodEntry>) => {
    if (!selectedDate) return;

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingEntry = getEntryForDate(selectedDate);

    const newEntry: MoodEntry = {
      id: existingEntry?.id || generateUUID(),
      date: dateString,
      moodScore: updates.moodScore!,
      moodLabel: updates.moodLabel!,
      note: updates.note,
      createdAt: existingEntry?.createdAt || getNowISO(),
      updatedAt: getNowISO(),
    };

    await saveEntry(newEntry);
  };

  // モーダル削除処理
  const handleModalDelete = async () => {
    if (!selectedDate) return;
    const entry = getEntryForDate(selectedDate);
    if (entry) {
      await deleteEntry(entry.id);
    }
  };

  // 日付範囲プリセット変更
  const handlePresetChange = (preset: DateRangePreset, range?: DateRange) => {
    setSelectedPreset(preset);
    setDateRange(range);

    // プリセット選択時、範囲の開始月にカレンダーを移動
    if (range) {
      setCurrentMonth(range.start);
    }
  };

  // 日付が選択範囲内かチェック
  const isInSelectedRange = (date: Date): boolean => {
    if (!dateRange) return true;
    return isWithinInterval(date, { start: dateRange.start, end: dateRange.end });
  };

  // 統計情報: 範囲内のエントリー数
  const entriesInRange = dateRange
    ? entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return isWithinInterval(entryDate, { start: dateRange.start, end: dateRange.end });
      })
    : entries;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <SkeletonCalendar />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 日付範囲セレクター */}
      <DateRangeSelector
        selectedPreset={selectedPreset}
        onPresetChange={handlePresetChange}
        currentRange={dateRange}
      />

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="前月"
        >
          ←
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
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
          className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="翌月"
        >
          →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
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
          const inRange = isInSelectedRange(day);

          return (
            <CalendarDay
              key={day.toString()}
              date={day}
              entry={entry}
              isToday={isToday}
              isCurrentMonth={isCurrentMonthDay && inRange}
              onClick={() => handleDayClick(day)}
            />
          );
        })}
      </div>

      {/* 統計情報 */}
      {dateRange && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              選択範囲内の記録数
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {entriesInRange.length}件
            </span>
          </div>
        </div>
      )}

      {/* 凡例 */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">カラー凡例</h3>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: MOOD_COLOR.terrible }}
            />
            <span>{MOOD_LABEL_DISPLAY_NAME.terrible}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: MOOD_COLOR.bad }}
            />
            <span>{MOOD_LABEL_DISPLAY_NAME.bad}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: MOOD_COLOR.okay }}
            />
            <span>{MOOD_LABEL_DISPLAY_NAME.okay}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: MOOD_COLOR.good }}
            />
            <span>{MOOD_LABEL_DISPLAY_NAME.good}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: MOOD_COLOR.great }}
            />
            <span>{MOOD_LABEL_DISPLAY_NAME.great}</span>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      <MoodDetailModal
        entry={getSelectedEntry()}
        date={selectedDate || new Date()}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />
    </div>
  );
}
