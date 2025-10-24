'use client';

import { useState, useEffect } from 'react';
import { MoodScore, MoodEntry, MOOD_SCORE_LABEL_MAP } from '@/types/mood';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';
import { successHaptic, errorHaptic } from '@/lib/haptics';
import { MoodIconButton } from './MoodIconButton';
import { MoodSuccessToast } from './MoodSuccessToast';
import { MoodNoteInput } from './MoodNoteInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function MoodRecorder() {
  const { saveEntry, getEntryByDate } = useMoodEntries();
  const [selectedScore, setSelectedScore] = useState<MoodScore | null>(null);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | undefined>(undefined);

  // 今日の記録を取得
  useEffect(() => {
    const loadTodayEntry = async () => {
      const entry = await getEntryByDate(getTodayISO());
      setTodayEntry(entry);
      if (entry) {
        setSelectedScore(entry.moodScore);
        setNote(entry.note || '');
      }
    };
    loadTodayEntry();
  }, [getEntryByDate]);

  // キーボードナビゲーション対応
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合はスキップ
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // 数字キー 1-5 で気分を選択
      const key = e.key;
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const score = parseInt(key) as MoodScore;
        if (!isSaving) {
          handleMoodClick(score);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSaving]);

  const handleMoodClick = async (score: MoodScore) => {
    await saveMoodEntry(score);
  };

  const saveMoodEntry = async (score: MoodScore) => {
    setIsSaving(true);

    const newEntry: MoodEntry = {
      id: todayEntry?.id || generateUUID(),
      date: getTodayISO(),
      moodScore: score,
      moodLabel: MOOD_SCORE_LABEL_MAP[score],
      createdAt: todayEntry?.createdAt || getNowISO(),
      updatedAt: todayEntry ? getNowISO() : undefined,
      note: note.trim() || undefined,
    };

    const success = await saveEntry(newEntry);

    if (success) {
      setSelectedScore(score);
      setTodayEntry(newEntry);
      setShowSuccess(true);

      // 成功ハプティックフィードバック
      successHaptic();

      // トーストを3秒後に非表示
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      // エラーハプティックフィードバック
      errorHaptic();
      alert('保存に失敗しました。もう一度お試しください。');
    }

    setIsSaving(false);
  };

  // メモが変更されたら自動保存
  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
  };

  const handleNoteSave = async () => {
    if (!selectedScore) {
      alert('気分を先に選択してください');
      return;
    }
    await saveMoodEntry(selectedScore);
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
        <p className="text-sm text-gray-500 mt-2">
          キーボード操作: 数字キー 1-5 で選択
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

      {/* メモ入力セクション */}
      {selectedScore && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              メモを追加 (任意)
            </h3>
            <MoodNoteInput
              value={note}
              onChange={handleNoteChange}
              disabled={isSaving}
            />
            <button
              onClick={handleNoteSave}
              disabled={isSaving}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && <LoadingSpinner size="sm" />}
              {isSaving ? '保存中...' : 'メモを保存'}
            </button>
          </div>
        </div>
      )}

      {/* 成功トースト */}
      {showSuccess && <MoodSuccessToast />}
    </div>
  );
}
