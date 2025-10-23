# Phase 7: メモ機能

**作成日**: 2025年10月23日
**Phase**: 7/12
**所要時間**: 60-90分
**前提条件**: Phase 1-6完了

---

## Phase概要

### 目的
気分記録にオプションのメモ(最大100文字)を追加する機能を実装。メモ入力UI、文字数制限、編集モーダルを構築。

### 成果物
- `components/mood/MoodNoteInput.tsx`: メモ入力コンポーネント
- `components/mood/MoodDetailModal.tsx`: 詳細編集モーダル
- 文字数カウンター
- 折りたたみUI

---

## 実装タスク詳細

### タスク1: MoodNoteInputコンポーネント (25分)

#### ファイル: `components/mood/MoodNoteInput.tsx`

```typescript
'use client';

import { useState } from 'react';
import { MAX_NOTE_LENGTH } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MoodNoteInput({ value, onChange, placeholder, disabled }: MoodNoteInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const remaining = MAX_NOTE_LENGTH - value.length;

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_NOTE_LENGTH))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || 'メモを追加 (任意)'}
        disabled={disabled}
        maxLength={MAX_NOTE_LENGTH}
        rows={3}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 transition-all',
          'focus:outline-none resize-none',
          isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300',
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
      />

      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-gray-500">
          {value.length > 0 ? '✏️ メモ付き' : '💭 メモなし'}
        </span>
        <span className={cn('font-medium', remaining < 20 && 'text-orange-600')}>
          残り {remaining} 文字
        </span>
      </div>
    </div>
  );
}
```

### タスク2: MoodDetailModalコンポーネント (35分)

#### ファイル: `components/mood/MoodDetailModal.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { MoodEntry, MoodScore, MOOD_SCORE_LABEL_MAP, MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { MoodNoteInput } from './MoodNoteInput';
import { MoodIconButton } from './MoodIconButton';
import { formatDateJP } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MoodDetailModalProps {
  entry: MoodEntry | null;
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<MoodEntry>) => void;
  onDelete?: () => void;
}

export function MoodDetailModal({ entry, date, isOpen, onClose, onSave, onDelete }: MoodDetailModalProps) {
  const [moodScore, setMoodScore] = useState<MoodScore>(entry?.moodScore || 3);
  const [note, setNote] = useState(entry?.note || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setMoodScore(entry.moodScore);
      setNote(entry.note || '');
    }
  }, [entry]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);

    onSave({
      moodScore,
      moodLabel: MOOD_SCORE_LABEL_MAP[moodScore],
      note: note.trim() || undefined,
    });

    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('この記録を削除しますか?')) {
      onDelete?.();
      onClose();
    }
  };

  const moodOptions: Array<{ score: MoodScore; label: typeof MOOD_SCORE_LABEL_MAP[MoodScore] }> = [
    { score: 1, label: MOOD_SCORE_LABEL_MAP[1] },
    { score: 2, label: MOOD_SCORE_LABEL_MAP[2] },
    { score: 3, label: MOOD_SCORE_LABEL_MAP[3] },
    { score: 4, label: MOOD_SCORE_LABEL_MAP[4] },
    { score: 5, label: MOOD_SCORE_LABEL_MAP[5] },
  ];

  return (
    <>
      {/* バックドロップ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {entry ? '記録を編集' : '記録を追加'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{formatDateJP(date)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>
          </div>

          {/* ボディ */}
          <div className="p-6 space-y-6">
            {/* 気分選択 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">気分</h3>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map(({ score, label }) => (
                  <MoodIconButton
                    key={score}
                    score={score}
                    label={label}
                    onClick={setMoodScore}
                    selected={moodScore === score}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </div>

            {/* メモ入力 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">メモ</h3>
              <MoodNoteInput
                value={note}
                onChange={setNote}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            {entry && onDelete ? (
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                削除
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

### タスク3: カレンダーとの統合 (20分)

#### ファイル: `components/calendar/MoodCalendar.tsx` (更新)

```typescript
// 先頭に追加
import { MoodDetailModal } from '@/components/mood/MoodDetailModal';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';

// useState追加
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// handleDayClick更新
const handleDayClick = (date: Date) => {
  setSelectedDate(date);
  setIsModalOpen(true);
};

// モーダル保存処理
const handleModalSave = (updates: Partial<MoodEntry>) => {
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

  saveEntry(newEntry);
};

// モーダル削除処理
const handleModalDelete = () => {
  if (!selectedDate) return;
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  deleteEntry(dateString);
};

// return内の最後に追加
<MoodDetailModal
  entry={selectedDate ? getEntryForDate(selectedDate) : null}
  date={selectedDate || new Date()}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleModalSave}
  onDelete={handleModalDelete}
/>
```

---

## チェックリスト

- [ ] メモ入力欄が表示される
- [ ] 文字数制限(100文字)が機能する
- [ ] モーダルで記録編集ができる
- [ ] 削除機能が動作する
- [ ] カレンダーから日付クリックでモーダルが開く

---

## 次のPhaseへの接続

Phase 8で統計・可視化機能を追加します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
