'use client';

import { BaseLayout } from './components/layout/BaseLayout';
import { Container } from './components/layout/Container';
import { MoodRecorder } from '@/components/mood/MoodRecorder';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { formatDateJP } from '@/lib/utils';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { FadeIn, SlideIn } from '@/components/transitions';

export default function Home() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <BaseLayout>
        <Container variant="wide">
          <div className="space-y-8">
            {/* Header skeleton */}
            <header className="text-center space-y-4 animate-pulse">
              <div className="h-12 bg-white/20 rounded w-48 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded w-64 mx-auto"></div>
            </header>

            {/* Recorder skeleton */}
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="space-y-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded w-32 mx-auto"></div>
                <div className="flex justify-center gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-white/20 rounded-full"></div>
                  ))}
                </div>
              </div>
            </section>

            {/* List skeleton */}
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="h-8 bg-white/20 rounded w-32 mb-6 animate-pulse"></div>
              <SkeletonList count={5} />
            </section>
          </div>
        </Container>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Container variant="wide">
        <div className="space-y-8">
          <FadeIn delay={0}>
            <header className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
                MoodTap
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                たった3秒で、心の健康を可視化する
              </p>
            </header>
          </FadeIn>

          {/* 気分記録セクション */}
          <SlideIn delay={100} direction="up">
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <MoodRecorder />
            </section>
          </SlideIn>

          {/* 記録一覧 */}
          <SlideIn delay={200} direction="up">
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
          </SlideIn>

          <FadeIn delay={300}>
            <footer className="text-center pt-8">
              <p className="text-sm text-[var(--color-text-muted)]">
                Phase 3: Mood Recording UI 実装中
              </p>
            </footer>
          </FadeIn>
        </div>
      </Container>
    </BaseLayout>
  );
}
