/**
 * Mood Types
 * 5段階の気分記録システムの型定義
 */

// 気分スコア: 1(最悪) ～ 5(最高)
export type MoodScore = 1 | 2 | 3 | 4 | 5;

// 気分ラベル
export type MoodLabel = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

// 気分エントリーのデータ構造
export interface MoodEntry {
  id: string;                // UUID
  date: string;              // ISO 8601 date string (YYYY-MM-DD)
  moodScore: MoodScore;      // 1-5の数値
  moodLabel: MoodLabel;      // terrible/bad/okay/good/great
  note?: string;             // オプショナルなメモ
  createdAt: string;         // ISO 8601 datetime string
  updatedAt?: string;        // ISO 8601 datetime string
}

// スコアからラベルへのマッピング
export const MOOD_SCORE_LABEL_MAP: Record<MoodScore, MoodLabel> = {
  1: 'terrible',
  2: 'bad',
  3: 'okay',
  4: 'good',
  5: 'great',
};

// ラベルからスコアへのマッピング
export const MOOD_LABEL_SCORE_MAP: Record<MoodLabel, MoodScore> = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  great: 5,
};

// 気分アイコン
export const MOOD_ICON: Record<MoodLabel, string> = {
  terrible: '😢',
  bad: '😕',
  okay: '😐',
  good: '😊',
  great: '😄',
};

// 気分カラー (Tailwind CSS対応)
export const MOOD_COLOR: Record<MoodLabel, string> = {
  terrible: '#ef4444', // red-500
  bad: '#f97316',      // orange-500
  okay: '#eab308',     // yellow-500
  good: '#22c55e',     // green-500
  great: '#3b82f6',    // blue-500
};

// 気分ラベルの日本語表示名
export const MOOD_LABEL_DISPLAY_NAME: Record<MoodLabel, string> = {
  terrible: '最悪',
  bad: '悪い',
  okay: '普通',
  good: '良い',
  great: '最高',
};

// 気分フィルター用のユーティリティ型
export type MoodFilter = 'all' | MoodLabel;

// 統計情報の型
export interface MoodStats {
  totalEntries: number;
  averageScore: number;
  moodDistribution: Record<MoodLabel, number>;
  currentStreak: number;
  longestStreak: number;
}
