# Phase 2: 型定義とユーティリティ

**作成日**: 2025年10月23日
**Phase**: 2/12
**所要時間**: 45-60分
**前提条件**: Phase 1完了 (TypeScript設定済み)

---

## 目次

1. [Phase概要](#phase概要)
2. [目的と目標](#目的と目標)
3. [技術要件](#技術要件)
4. [実装タスク詳細](#実装タスク詳細)
5. [コード例](#コード例)
6. [チェックリスト](#チェックリスト)
7. [トラブルシューティング](#トラブルシューティング)
8. [次のPhaseへの接続](#次のphaseへの接続)

---

## Phase概要

### 目的
アプリケーション全体で使用するTypeScript型システムを構築し、型安全性を確保する。気分記録データ、ユーティリティ関数の型定義を実装する。

### 成果物
- `types/mood.ts`: Mood関連型定義
- `lib/utils.ts`: 日付操作ユーティリティ
- `lib/constants.ts`: アプリケーション定数
- Type Guards (型ガード関数)

---

## 目的と目標

### ビジネス目標
- データの一貫性確保
- バグの早期発見
- コード自動補完による開発速度向上

### 技術目標
- **厳格な型チェック**: ランタイムエラーの防止
- **Union型の活用**: 気分スコアの制限
- **Type Guards**: 安全なデータ検証
- **ユーティリティ関数**: 日付操作の標準化

---

## 技術要件

### TypeScript機能
- Union型
- Literal型
- Type Guards
- インターフェース
- ユーティリティ型 (`Readonly`, `Partial` 等)

### 依存パッケージ
```json
{
  "dependencies": {
    "date-fns": "^3.0.0"  // 日付操作ライブラリ
  }
}
```

---

## 実装タスク詳細

### タスク1: Mood型定義 (20分)

#### ファイル: `types/mood.ts`

```typescript
/**
 * 気分スコア (1-5の範囲)
 * 1: 最悪, 2: 悪い, 3: 普通, 4: 良い, 5: 最高
 */
export type MoodScore = 1 | 2 | 3 | 4 | 5;

/**
 * 気分ラベル
 */
export type MoodLabel = 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';

/**
 * 気分記録エントリ
 */
export interface MoodEntry {
  /** ユニークID (UUID v4形式) */
  id: string;

  /** 記録日付 (ISO 8601形式: YYYY-MM-DD) */
  date: string;

  /** 気分スコア */
  moodScore: MoodScore;

  /** 気分ラベル */
  moodLabel: MoodLabel;

  /** オプションメモ (100文字以内) */
  note?: string;

  /** 作成日時 (ISO 8601形式) */
  createdAt: string;

  /** 更新日時 (オプション) */
  updatedAt?: string;
}

/**
 * 気分スコアとラベルのマッピング
 */
export const MOOD_SCORE_LABEL_MAP: Record<MoodScore, MoodLabel> = {
  1: 'very_bad',
  2: 'bad',
  3: 'neutral',
  4: 'good',
  5: 'very_good',
} as const;

/**
 * 気分ラベルの表示名
 */
export const MOOD_LABEL_DISPLAY_NAME: Record<MoodLabel, string> = {
  very_bad: '最悪',
  bad: '悪い',
  neutral: '普通',
  good: '良い',
  very_good: '最高',
} as const;

/**
 * 気分アイコン (絵文字)
 */
export const MOOD_ICON: Record<MoodLabel, string> = {
  very_bad: '😢',
  bad: '😟',
  neutral: '😐',
  good: '😊',
  very_good: '😄',
} as const;

/**
 * 気分カラー (Tailwind設定と同期)
 */
export const MOOD_COLOR: Record<MoodLabel, string> = {
  very_bad: '#EF4444',
  bad: '#FB923C',
  neutral: '#9CA3AF',
  good: '#60A5FA',
  very_good: '#3B82F6',
} as const;
```

#### Type Guardsの実装

```typescript
/**
 * MoodScore型ガード
 */
export function isMoodScore(value: unknown): value is MoodScore {
  return typeof value === 'number' && value >= 1 && value <= 5 && Number.isInteger(value);
}

/**
 * MoodLabel型ガード
 */
export function isMoodLabel(value: unknown): value is MoodLabel {
  return typeof value === 'string' && ['very_bad', 'bad', 'neutral', 'good', 'very_good'].includes(value);
}

/**
 * MoodEntry型ガード
 */
export function isMoodEntry(obj: unknown): obj is MoodEntry {
  if (typeof obj !== 'object' || obj === null) return false;

  const entry = obj as Record<string, unknown>;

  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    isMoodScore(entry.moodScore) &&
    isMoodLabel(entry.moodLabel) &&
    typeof entry.createdAt === 'string' &&
    (entry.note === undefined || typeof entry.note === 'string')
  );
}

/**
 * MoodEntryの配列型ガード
 */
export function isMoodEntryArray(arr: unknown): arr is MoodEntry[] {
  return Array.isArray(arr) && arr.every(isMoodEntry);
}
```

### タスク2: ユーティリティ関数 (15分)

#### ファイル: `lib/utils.ts`

```typescript
import { format, parse, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付をISO 8601形式 (YYYY-MM-DD) に変換
 */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * ISO 8601形式の日付文字列をDateオブジェクトに変換
 */
export function parseDateISO(dateString: string): Date | null {
  try {
    const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * 今日の日付をISO 8601形式で取得
 */
export function getTodayISO(): string {
  return formatDateISO(new Date());
}

/**
 * 現在のタイムスタンプをISO 8601形式で取得
 */
export function getNowISO(): string {
  return new Date().toISOString();
}

/**
 * 日付を日本語フォーマットで表示
 * 例: "2025年10月23日 (水)"
 */
export function formatDateJP(date: Date): string {
  return format(date, 'yyyy年M月d日 (E)', { locale: ja });
}

/**
 * 月の全日付を取得
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end });
}

/**
 * UUID v4生成 (簡易版)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * クラス名を条件付きで結合
 * (clsx/classnames代替)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 文字列の切り詰め
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
```

### タスク3: アプリケーション定数 (10分)

#### ファイル: `lib/constants.ts`

```typescript
/**
 * LocalStorageキー
 */
export const STORAGE_KEY = 'moodtap_entries';

/**
 * メモの最大文字数
 */
export const MAX_NOTE_LENGTH = 100;

/**
 * カレンダー表示月数
 */
export const CALENDAR_MONTHS_TO_SHOW = 3;

/**
 * アニメーション時間 (ミリ秒)
 */
export const ANIMATION = {
  BOUNCE_DURATION: 500,
  FADE_DURATION: 300,
  TOAST_DURATION: 2000,
} as const;

/**
 * アプリケーションメタデータ
 */
export const APP_META = {
  NAME: 'MoodTap',
  DESCRIPTION: '1タップで気分を記録するセルフケアアプリ',
  VERSION: '1.0.0',
  AUTHOR: 'MoodTap Team',
} as const;

/**
 * ルーティングパス
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CALENDAR: '/calendar',
  STATS: '/stats',
  SETTINGS: '/settings',
} as const;
```

---

## コード例

### 型の使用例

```typescript
// components/mood/MoodButton.tsx
'use client';

import { MoodScore, MoodLabel, MOOD_ICON, MOOD_COLOR } from '@/types/mood';

interface MoodButtonProps {
  score: MoodScore;
  label: MoodLabel;
  onClick: (score: MoodScore) => void;
}

export function MoodButton({ score, label, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={() => onClick(score)}
      style={{ backgroundColor: MOOD_COLOR[label] }}
      className="p-4 rounded-lg text-4xl"
    >
      {MOOD_ICON[label]}
    </button>
  );
}
```

### Type Guardsの使用例

```typescript
// lib/localStorage.ts
import { MoodEntry, isMoodEntry, isMoodEntryArray } from '@/types/mood';
import { STORAGE_KEY } from '@/lib/constants';

export function getMoodEntries(): MoodEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);

    // Type Guardによる安全な検証
    if (isMoodEntryArray(parsed)) {
      return parsed;
    }

    console.error('Invalid mood entries data');
    return [];
  } catch (error) {
    console.error('Failed to load mood entries:', error);
    return [];
  }
}
```

### ユーティリティ関数の使用例

```typescript
// components/calendar/CalendarGrid.tsx
import { getDaysInMonth, formatDateISO } from '@/lib/utils';

export function CalendarGrid({ year, month }: { year: number; month: number }) {
  const days = getDaysInMonth(year, month);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date) => (
        <div key={formatDateISO(date)} className="p-2">
          {date.getDate()}
        </div>
      ))}
    </div>
  );
}
```

---

## チェックリスト

### 完了基準

- [ ] `types/mood.ts`が作成され、全ての型が定義されている
- [ ] Type Guardsが実装され、正しく動作する
- [ ] `lib/utils.ts`が作成され、日付操作関数が実装されている
- [ ] `lib/constants.ts`が作成され、定数が定義されている
- [ ] `npx tsc --noEmit`でエラーが出ない
- [ ] ESLint警告が0件

### テスト項目

```typescript
// __tests__/types/mood.test.ts (将来実装)
import { isMoodScore, isMoodLabel, isMoodEntry } from '@/types/mood';

// MoodScore検証
console.assert(isMoodScore(3) === true);
console.assert(isMoodScore(6) === false);
console.assert(isMoodScore('3') === false);

// MoodLabel検証
console.assert(isMoodLabel('good') === true);
console.assert(isMoodLabel('excellent') === false);

// MoodEntry検証
const validEntry = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  date: '2025-10-23',
  moodScore: 4,
  moodLabel: 'good',
  createdAt: '2025-10-23T10:00:00Z',
};
console.assert(isMoodEntry(validEntry) === true);
```

---

## トラブルシューティング

### 問題1: 型エラー "Type 'number' is not assignable to type 'MoodScore'"

**症状:**
```typescript
const score: MoodScore = userInput; // エラー
```

**解決策:**
```typescript
import { isMoodScore } from '@/types/mood';

if (isMoodScore(userInput)) {
  const score: MoodScore = userInput; // OK
}
```

### 問題2: date-fnsのインポートエラー

**症状:**
```
Module not found: Can't resolve 'date-fns'
```

**解決策:**
```bash
npm install date-fns
```

### 問題3: Type Guardsが正しく動作しない

**症状:**
型ガードを通過してもTypeScriptが型を推論しない

**解決策:**
```typescript
// 悪い例 (戻り値の型が欠落)
function isMoodScore(value: unknown) {
  return typeof value === 'number' && value >= 1 && value <= 5;
}

// 良い例 (型述語を使用)
function isMoodScore(value: unknown): value is MoodScore {
  return typeof value === 'number' && value >= 1 && value <= 5;
}
```

---

## 次のPhaseへの接続

### Phase 3への引き継ぎ事項

1. **準備完了事項**
   - `MoodEntry`型が定義済み
   - Type Guardsが実装済み
   - `STORAGE_KEY`定数が定義済み

2. **Phase 3で実装する内容**
   - `lib/localStorage.ts`: CRUD操作関数
   - `isMoodEntry`を使ったデータ検証
   - エラーハンドリング

3. **依存関係**
   - Phase 3は`types/mood.ts`の`MoodEntry`型に依存
   - LocalStorageのデータ保存/取得でType Guardsを使用

### 確認事項

```bash
# 型定義ファイル確認
cat types/mood.ts

# ユーティリティ関数確認
cat lib/utils.ts

# 型チェック
npx tsc --noEmit
```

---

## まとめ

### 達成した内容
- ✅ TypeScript型システムの構築
- ✅ Union型による厳格な値制限
- ✅ Type Guardsによる安全なデータ検証
- ✅ 日付操作ユーティリティの実装
- ✅ アプリケーション定数の定義

### 次のステップ
Phase 3の詳細ドキュメント `20251023_03-local-storage.md` を確認し、LocalStorageデータ管理の実装に進んでください。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
