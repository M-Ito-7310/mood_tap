# Phase 5: 気分記録UIコンポーネント

**作成日**: 2025年10月23日
**Phase**: 5/12
**所要時間**: 90-120分
**前提条件**: Phase 1-4完了

---

## Phase概要

### 目的
5段階の気分アイコンボタンを実装し、1タップでの気分記録を実現。心地よいアニメーションとフィードバックで習慣化を促進。

### 成果物
- `components/mood/MoodIconButton.tsx`: アイコンボタン
- `components/mood/MoodRecorder.tsx`: 記録コントロール
- `components/mood/MoodSuccessToast.tsx`: 記録完了トースト
- アニメーション実装

---

## 実装タスク詳細

### タスク1: MoodIconButtonコンポーネント (30分)

#### ファイル: `components/mood/MoodIconButton.tsx`

```typescript
'use client';

import { MoodScore, MoodLabel, MOOD_ICON, MOOD_COLOR, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MoodIconButtonProps {
  score: MoodScore;
  label: MoodLabel;
  onClick: (score: MoodScore) => void;
  disabled?: boolean;
  selected?: boolean;
}

export function MoodIconButton({ score, label, onClick, disabled, selected }: MoodIconButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsPressed(true);
    onClick(score);

    setTimeout(() => setIsPressed(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-2 p-6 rounded-2xl transition-all duration-300',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        isPressed && 'animate-bounce-in',
        selected && 'ring-4 ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      style={{
        backgroundColor: selected ? MOOD_COLOR[label] + '20' : 'white',
        borderColor: MOOD_COLOR[label],
        borderWidth: '2px',
        '--tw-ring-color': MOOD_COLOR[label],
      } as React.CSSProperties}
    >
      <span className="text-5xl md:text-6xl">{MOOD_ICON[label]}</span>
      <span className="text-sm font-medium text-gray-700">
        {MOOD_LABEL_DISPLAY_NAME[label]}
      </span>
    </button>
  );
}
```

### タスク2: MoodRecorderコンポーネント (40分)

#### ファイル: `components/mood/MoodRecorder.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { MoodScore, MoodEntry, MOOD_SCORE_LABEL_MAP } from '@/types/mood';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';
import { MoodIconButton } from './MoodIconButton';
import { MoodSuccessToast } from './MoodSuccessToast';

export function MoodRecorder() {
  const { entries, saveEntry, getEntryByDate } = useMoodEntries();
  const [selectedScore, setSelectedScore] = useState<MoodScore | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 今日の記録を取得
  const todayEntry = getEntryByDate(getTodayISO());

  useEffect(() => {
    if (todayEntry) {
      setSelectedScore(todayEntry.moodScore);
    }
  }, [todayEntry]);

  const handleMoodClick = async (score: MoodScore) => {
    setIsSaving(true);

    const newEntry: MoodEntry = {
      id: todayEntry?.id || generateUUID(),
      date: getTodayISO(),
      moodScore: score,
      moodLabel: MOOD_SCORE_LABEL_MAP[score],
      createdAt: todayEntry?.createdAt || getNowISO(),
      updatedAt: todayEntry ? getNowISO() : undefined,
      note: todayEntry?.note,
    };

    const success = saveEntry(newEntry);

    if (success) {
      setSelectedScore(score);
      setShowSuccess(true);

      // トーストを3秒後に非表示
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert('保存に失敗しました。もう一度お試しください。');
    }

    setIsSaving(false);
  };

  const moodOptions: Array<{ score: MoodScore; label: typeof MOOD_SCORE_LABEL_MAP[MoodScore] }> = [
    { score: 1, label: MOOD_SCORE_LABEL_MAP[1] },
    { score: 2, label: MOOD_SCORE_LABEL_MAP[2] },
    { score: 3, label: MOOD_SCORE_LABEL_MAP[3] },
    { score: 4, label: MOOD_SCORE_LABEL_MAP[4] },
    { score: 5, label: MOOD_SCORE_LABEL_MAP[5] },
  ];

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {todayEntry ? '今日の気分を変更' : '今日の気分は?'}
        </h2>
        <p className="text-gray-600">
          1つ選んでタップしてください
        </p>
      </div>

      {/* 気分アイコンボタン */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {moodOptions.map(({ score, label }) => (
          <MoodIconButton
            key={score}
            score={score}
            label={label}
            onClick={handleMoodClick}
            disabled={isSaving}
            selected={selectedScore === score}
          />
        ))}
      </div>

      {/* 成功トースト */}
      {showSuccess && <MoodSuccessToast />}
    </div>
  );
}
```

### タスク3: MoodSuccessToastコンポーネント (20分)

#### ファイル: `components/mood/MoodSuccessToast.tsx`

```typescript
'use client';

export function MoodSuccessToast() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <span className="font-medium">記録しました!</span>
      </div>
    </div>
  );
}
```

### タスク4: ダッシュボードに統合 (20分)

#### ファイル: `app/dashboard/DashboardClient.tsx` (更新)

```typescript
'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MoodRecorder } from '@/components/mood/MoodRecorder';
import { MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { formatDateJP } from '@/lib/utils';

export function DashboardClient() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">あなたの気分記録</p>
        </header>

        {/* 気分記録セクション */}
        <section className="card mb-8">
          <MoodRecorder />
        </section>

        {/* 記録一覧 */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">最近の記録</h2>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">まだ記録がありません</p>
              <p className="text-sm">最初の気分を記録してみましょう!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{MOOD_ICON[entry.moodLabel]}</span>
                    <div>
                      <p className="font-medium">{MOOD_LABEL_DISPLAY_NAME[entry.moodLabel]}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateJP(new Date(entry.date))}
                      </p>
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-gray-600 max-w-xs truncate">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

---

## チェックリスト

- [ ] 5つの気分アイコンボタンが表示される
- [ ] ボタンクリックで記録が保存される
- [ ] 成功トーストが表示される
- [ ] アニメーションが滑らかに動作する
- [ ] 今日の記録が既にある場合、選択状態が表示される
- [ ] レスポンシブデザインが機能する

---

## 次のPhaseへの接続

Phase 6でカレンダー表示機能を実装し、記録をビジュアライズします。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
