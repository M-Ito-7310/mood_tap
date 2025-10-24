'use client';

import { MoodScore, MoodLabel, MOOD_ICON, MOOD_COLOR, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { cn } from '@/lib/utils';
import { lightHaptic } from '@/lib/haptics';
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

    // ハプティックフィードバック
    lightHaptic();

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
        isPressed && 'animate-bounce',
        selected && 'ring-4 ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      style={{
        backgroundColor: selected ? MOOD_COLOR[label] + '20' : 'white',
        borderColor: MOOD_COLOR[label],
        borderWidth: '2px',
        // @ts-ignore - CSS custom property
        '--tw-ring-color': MOOD_COLOR[label],
      }}
    >
      <span className="text-5xl md:text-6xl">{MOOD_ICON[label]}</span>
      <span className="text-sm font-medium text-gray-700">
        {MOOD_LABEL_DISPLAY_NAME[label]}
      </span>
    </button>
  );
}
