import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSクラスを結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UUID v4を生成
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * 現在日時をISO 8601形式で取得
 */
export function getNowISO(): string {
  return new Date().toISOString();
}

/**
 * Date オブジェクトをYYYY-MM-DD形式に変換
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 日付を日本語形式でフォーマット (例: 2025年10月23日)
 */
export function formatDateJP(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 日付を曜日付きでフォーマット (例: 10月23日(月))
 */
export function formatDateWithWeekday(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日(${weekday})`;
}

/**
 * ISO日付文字列をDateオブジェクトに変換
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * 2つの日付が同じ日かどうかを判定
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return toISODate(date1) === toISODate(date2);
}

/**
 * 指定された日数前の日付を取得
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * 2つの日付の間の日数を計算
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}
