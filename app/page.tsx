'use client';

import { BaseLayout } from './components/layout/BaseLayout';
import { Container } from './components/layout/Container';
import { MoodRecorder } from '@/components/mood/MoodRecorder';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { formatDateJP } from '@/lib/utils';

export default function Home() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <BaseLayout>
        <Container variant="narrow">
          <div className="text-center">
            <div className="text-xl text-[var(--color-text-secondary)]">読み込み中...</div>
          </div>
        </Container>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Container variant="wide">
        <div className="space-y-8">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
              MoodTap
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
              たった3秒で、心の健康を可視化する
            </p>
          </header>

          {/* 気分記録セクション */}
          <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
            <MoodRecorder />
          </section>

          {/* 記録一覧 */}
          <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)]">
              最近の記録
            </h2>

            {entries.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p className="text-lg mb-2">まだ記録がありません</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  最初の気分を記録してみましょう!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{MOOD_ICON[entry.moodLabel]}</span>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {MOOD_LABEL_DISPLAY_NAME[entry.moodLabel]}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {formatDateJP(new Date(entry.date))}
                        </p>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-[var(--color-text-secondary)] max-w-xs truncate">
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="text-center pt-8">
            <p className="text-sm text-[var(--color-text-muted)]">
              Phase 3: Mood Recording UI 実装中
            </p>
          </footer>
        </div>
      </Container>
    </BaseLayout>
  );
}
