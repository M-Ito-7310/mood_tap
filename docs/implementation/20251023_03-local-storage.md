# Phase 3: LocalStorageデータ管理

**作成日**: 2025年10月23日
**Phase**: 3/12
**所要時間**: 30-45分
**前提条件**: Phase 2完了 (型定義済み)

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
ブラウザのLocalStorageを使用したクライアントサイドデータ永続化を実装。気分記録のCRUD操作とエラーハンドリングを構築する。

### 成果物
- `lib/localStorage.ts`: CRUD操作関数
- データバリデーション機能
- エラーハンドリング
- データマイグレーション対応

---

## 目的と目標

### ビジネス目標
- **オフライン動作**: ネットワーク不要でアプリ使用可能
- **即座の利用開始**: 認証不要でMVP検証
- **データ永続化**: ブラウザを閉じても記録保持

### 技術目標
- **CRUD操作**: Create, Read, Update, Delete
- **Type-Safe**: Type Guardsによる安全なデータ検証
- **エラーハンドリング**: LocalStorageアクセス失敗への対応
- **パフォーマンス**: 高速なデータ取得

---

## 技術要件

### LocalStorage仕様
- **容量制限**: 約5-10MB (ブラウザ依存)
- **データ形式**: JSON文字列
- **スコープ**: オリジン(プロトコル + ドメイン + ポート)ごと
- **同期API**: ブロッキング操作

### セキュリティ考慮事項
- プライベートブラウジングモード対応
- LocalStorage無効化環境への対応
- データ破損への対処

---

## 実装タスク詳細

### タスク1: CRUD操作関数の実装 (20分)

#### ファイル: `lib/localStorage.ts`

```typescript
import { MoodEntry, isMoodEntry, isMoodEntryArray } from '@/types/mood';
import { STORAGE_KEY } from '@/lib/constants';

/**
 * LocalStorageが利用可能かチェック
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__moodtap_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 全ての気分記録を取得
 */
export function getMoodEntries(): MoodEntry[] {
  if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);

    // Type Guardによる検証
    if (isMoodEntryArray(parsed)) {
      return parsed.sort((a, b) => b.date.localeCompare(a.date)); // 降順ソート
    }

    console.error('Invalid mood entries data format');
    return [];
  } catch (error) {
    console.error('Failed to load mood entries:', error);
    return [];
  }
}

/**
 * 特定日付の気分記録を取得
 */
export function getMoodEntryByDate(date: string): MoodEntry | null {
  const entries = getMoodEntries();
  return entries.find((entry) => entry.date === date) || null;
}

/**
 * 気分記録を保存 (新規作成または更新)
 */
export function saveMoodEntry(entry: MoodEntry): boolean {
  if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
    console.error('LocalStorage is not available');
    return false;
  }

  // データ検証
  if (!isMoodEntry(entry)) {
    console.error('Invalid mood entry:', entry);
    return false;
  }

  try {
    const entries = getMoodEntries();

    // 既存エントリの更新または新規追加
    const existingIndex = entries.findIndex((e) => e.date === entry.date);

    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      entries.push(entry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Failed to save mood entry:', error);
    return false;
  }
}

/**
 * 気分記録を削除
 */
export function deleteMoodEntry(date: string): boolean {
  if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
    return false;
  }

  try {
    const entries = getMoodEntries();
    const filtered = entries.filter((entry) => entry.date !== date);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete mood entry:', error);
    return false;
  }
}

/**
 * 全ての気分記録を削除
 */
export function clearAllMoodEntries(): boolean {
  if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear mood entries:', error);
    return false;
  }
}

/**
 * 期間指定で気分記録を取得
 */
export function getMoodEntriesByDateRange(startDate: string, endDate: string): MoodEntry[] {
  const entries = getMoodEntries();
  return entries.filter((entry) => entry.date >= startDate && entry.date <= endDate);
}

/**
 * データのエクスポート (将来のバックアップ機能用)
 */
export function exportMoodEntries(): string {
  const entries = getMoodEntries();
  return JSON.stringify(entries, null, 2);
}

/**
 * データのインポート
 */
export function importMoodEntries(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);

    if (isMoodEntryArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }

    console.error('Invalid import data format');
    return false;
  } catch (error) {
    console.error('Failed to import mood entries:', error);
    return false;
  }
}
```

### タスク2: カスタムReact Hook (15分)

#### ファイル: `hooks/useMoodEntries.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { MoodEntry } from '@/types/mood';
import {
  getMoodEntries,
  getMoodEntryByDate,
  saveMoodEntry,
  deleteMoodEntry,
} from '@/lib/localStorage';

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回ロード
  useEffect(() => {
    const loadEntries = () => {
      const data = getMoodEntries();
      setEntries(data);
      setIsLoading(false);
    };

    loadEntries();
  }, []);

  // 保存
  const saveEntry = (entry: MoodEntry): boolean => {
    const success = saveMoodEntry(entry);
    if (success) {
      setEntries(getMoodEntries()); // 再取得
    }
    return success;
  };

  // 削除
  const deleteEntry = (date: string): boolean => {
    const success = deleteMoodEntry(date);
    if (success) {
      setEntries(getMoodEntries()); // 再取得
    }
    return success;
  };

  // 特定日付取得
  const getEntryByDate = (date: string): MoodEntry | null => {
    return getMoodEntryByDate(date);
  };

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry,
    getEntryByDate,
  };
}
```

---

## コード例

### 使用例: 気分記録の保存

```typescript
'use client';

import { useState } from 'react';
import { MoodEntry, MoodScore, MOOD_SCORE_LABEL_MAP } from '@/types/mood';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';
import { useMoodEntries } from '@/hooks/useMoodEntries';

export function MoodRecorder() {
  const { saveEntry } = useMoodEntries();
  const [isSaving, setIsSaving] = useState(false);

  const handleMoodClick = (score: MoodScore) => {
    setIsSaving(true);

    const newEntry: MoodEntry = {
      id: generateUUID(),
      date: getTodayISO(),
      moodScore: score,
      moodLabel: MOOD_SCORE_LABEL_MAP[score],
      createdAt: getNowISO(),
    };

    const success = saveEntry(newEntry);

    if (success) {
      alert('記録しました!');
    } else {
      alert('保存に失敗しました');
    }

    setIsSaving(false);
  };

  return (
    <div>
      <h2>今日の気分は?</h2>
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} onClick={() => handleMoodClick(score as MoodScore)} disabled={isSaving}>
          {score}
        </button>
      ))}
    </div>
  );
}
```

### 使用例: データ表示

```typescript
'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MOOD_ICON } from '@/types/mood';

export function MoodList() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (entries.length === 0) {
    return <div>まだ記録がありません</div>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.date} - {MOOD_ICON[entry.moodLabel]} {entry.note}
        </li>
      ))}
    </ul>
  );
}
```

---

## チェックリスト

### 完了基準

- [ ] `lib/localStorage.ts`が作成されている
- [ ] CRUD操作が全て実装されている
- [ ] `hooks/useMoodEntries.ts`が作成されている
- [ ] Type Guardsによるデータ検証が動作する
- [ ] エラーハンドリングが実装されている
- [ ] ブラウザDevToolsでLocalStorageにデータが保存される

### テスト項目

```typescript
// ブラウザコンソールでテスト
import { saveMoodEntry, getMoodEntries, deleteMoodEntry } from '@/lib/localStorage';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';

// 1. 保存テスト
const testEntry = {
  id: generateUUID(),
  date: getTodayISO(),
  moodScore: 4,
  moodLabel: 'good',
  createdAt: getNowISO(),
};
console.log('Save result:', saveMoodEntry(testEntry));

// 2. 取得テスト
console.log('Entries:', getMoodEntries());

// 3. 削除テスト
console.log('Delete result:', deleteMoodEntry(getTodayISO()));
```

---

## トラブルシューティング

### 問題1: LocalStorageが使えない (プライベートモード)

**症状:**
```
QuotaExceededError: The quota has been exceeded.
```

**解決策:**
```typescript
// isLocalStorageAvailable()でチェック
if (!isLocalStorageAvailable()) {
  alert('プライベートブラウジングモードでは一部機能が制限されます');
  // Fallback: メモリ内保存
  const memoryStore: MoodEntry[] = [];
}
```

### 問題2: データ破損

**症状:**
LocalStorageから読み込んだデータがパースできない

**解決策:**
```typescript
export function getMoodEntries(): MoodEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);

    if (isMoodEntryArray(parsed)) {
      return parsed;
    }

    // データが無効な場合、バックアップして初期化
    console.warn('Corrupted data detected, resetting...');
    localStorage.setItem(STORAGE_KEY + '_backup', data);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch {
    return [];
  }
}
```

### 問題3: 容量超過

**症状:**
```
QuotaExceededError: Failed to execute 'setItem' on 'Storage'
```

**解決策:**
```typescript
export function saveMoodEntry(entry: MoodEntry): boolean {
  try {
    const entries = getMoodEntries();

    // 古いエントリを削除 (例: 1年以上前)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const filtered = entries.filter(
      (e) => new Date(e.date) > oneYearAgo
    );

    filtered.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('ストレージ容量が不足しています。古いデータを削除してください。');
    }
    return false;
  }
}
```

---

## 次のPhaseへの接続

### Phase 4への引き継ぎ事項

1. **準備完了事項**
   - CRUD操作関数が実装済み
   - `useMoodEntries`フックが利用可能
   - データ永続化が動作確認済み

2. **Phase 4で実装する内容**
   - ランディングページでのデータ表示
   - ダッシュボードでのデータ一覧
   - `useMoodEntries`フックの利用

3. **依存関係**
   - Phase 4のUIコンポーネントは`useMoodEntries`を使用
   - Phase 5の気分記録UIは`saveMoodEntry`を使用

### 確認事項

```bash
# ファイル確認
cat lib/localStorage.ts
cat hooks/useMoodEntries.ts

# 型チェック
npx tsc --noEmit
```

---

## まとめ

### 達成した内容
- ✅ LocalStorage CRUD操作の実装
- ✅ Type Guardsによる安全なデータ検証
- ✅ エラーハンドリングの実装
- ✅ カスタムReact Hookの作成
- ✅ データインポート/エクスポート機能

### 次のステップ
Phase 4の詳細ドキュメント `20251023_04-basic-layout.md` を確認し、基本レイアウトとUIの実装に進んでください。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
