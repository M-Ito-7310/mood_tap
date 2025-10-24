import { MoodEntry } from '@/types/mood';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';

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
      dayLabel: format(day, 'E', { locale: ja }),
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
