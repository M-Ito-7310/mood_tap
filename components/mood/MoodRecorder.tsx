'use client';

import { useState, useEffect } from 'react';
import { MoodScore, MoodEntry, MOOD_SCORE_LABEL_MAP } from '@/types/mood';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { generateUUID, getTodayISO, getNowISO } from '@/lib/utils';
import { successHaptic, errorHaptic } from '@/lib/haptics';
import { MoodIconButton } from './MoodIconButton';
import { MoodSuccessToast } from './MoodSuccessToast';

export function MoodRecorder() {
  const { saveEntry, getEntryByDate } = useMoodEntries();
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
