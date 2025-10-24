/**
 * テーマ設定の型定義
 */

export type ThemeType = 'default' | 'sunset' | 'ocean' | 'forest' | 'monochrome';

export interface Theme {
  id: ThemeType;
  name: string;
  gradient: string; // Tailwind gradient classes
  description: string;
}

export const THEMES: Record<ThemeType, Theme> = {
  default: {
    id: 'default',
    name: 'デフォルト',
    gradient: 'from-blue-50 via-purple-50 to-pink-50',
    description: '明るく優しいグラデーション',
  },
  sunset: {
    id: 'sunset',
    name: 'サンセット',
    gradient: 'from-orange-50 via-red-50 to-pink-50',
    description: '夕暮れの温かみのある色合い',
  },
  ocean: {
    id: 'ocean',
    name: 'オーシャン',
    gradient: 'from-cyan-50 via-blue-50 to-indigo-50',
    description: '海のような爽やかな青',
  },
  forest: {
    id: 'forest',
    name: 'フォレスト',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    description: '森林のような落ち着いた緑',
  },
  monochrome: {
    id: 'monochrome',
    name: 'モノクローム',
    gradient: 'from-gray-50 via-slate-50 to-zinc-50',
    description: 'シンプルでミニマルな白黒',
  },
};
