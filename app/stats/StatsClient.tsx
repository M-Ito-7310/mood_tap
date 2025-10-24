'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MoodChart } from '@/components/stats/MoodChart';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { calculateAverageMood, getMoodExtremes } from '@/lib/stats';

export function StatsClient() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  const avgMood = calculateAverageMood(entries);
  const { highest, lowest } = getMoodExtremes(entries);

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">統計</h1>
          <p className="text-gray-600 mt-2">あなたの気分データを分析</p>
        </header>

        <div className="space-y-6">
          {/* サマリーカード */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-gray-600 mb-2">総記録数</p>
              <p className="text-4xl font-bold text-blue-600">{entries.length}</p>
            </div>

            <div className="card text-center">
              <p className="text-gray-600 mb-2">平均気分</p>
              <p className="text-4xl font-bold text-green-600">{avgMood.toFixed(1)}</p>
            </div>

            <StreakDisplay entries={entries} />
          </div>

          {/* グラフ */}
          <MoodChart entries={entries} />

          {/* その他統計 */}
          {highest !== null && lowest !== null && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">気分の範囲</h3>
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">最高</p>
                  <p className="text-3xl font-bold text-blue-600">{highest}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">最低</p>
                  <p className="text-3xl font-bold text-red-600">{lowest}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
