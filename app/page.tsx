'use client';

import { BaseLayout } from './components/layout/BaseLayout';
import { Container } from './components/layout/Container';
import { MoodButton } from './components/mood/MoodButton';
import type { MoodLevel } from './components/mood/MoodButton';

export default function Home() {
  const handleMoodClick = (level: MoodLevel, label: string) => {
    console.log(`Mood selected: ${level} (${label})`);
  };

  return (
    <BaseLayout>
      <Container variant="narrow">
        <div className="text-center space-y-8">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
              MoodTap
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
              たった3秒で、心の健康を可視化する
            </p>
          </header>

          <div className="flex gap-4 justify-center flex-wrap">
            <MoodButton
              level="veryBad"
              label="とても悪い"
              onClick={() => handleMoodClick('veryBad', 'とても悪い')}
            />
            <MoodButton
              level="bad"
              label="悪い"
              onClick={() => handleMoodClick('bad', '悪い')}
            />
            <MoodButton
              level="neutral"
              label="普通"
              onClick={() => handleMoodClick('neutral', '普通')}
            />
            <MoodButton
              level="good"
              label="良い"
              onClick={() => handleMoodClick('good', '良い')}
            />
            <MoodButton
              level="veryGood"
              label="とても良い"
              onClick={() => handleMoodClick('veryGood', 'とても良い')}
            />
          </div>

          <footer className="pt-8">
            <p className="text-sm text-[var(--color-text-muted)]">
              Phase 2: UI Foundation & Design System 完了
            </p>
          </footer>
        </div>
      </Container>
    </BaseLayout>
  );
}
