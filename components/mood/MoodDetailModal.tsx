'use client';

import { useState, useEffect } from 'react';
import { MoodEntry, MoodScore, MOOD_SCORE_LABEL_MAP } from '@/types/mood';
import { MoodNoteInput } from './MoodNoteInput';
import { MoodIconButton } from './MoodIconButton';
import { formatDateJP } from '@/lib/utils';

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
