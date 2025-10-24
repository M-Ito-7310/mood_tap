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
      aria-label={`気分を${MOOD_LABEL_DISPLAY_NAME[label]}として記録`}
      aria-pressed={selected}
      className={cn(
        'relative flex flex-col items-center gap-2 p-6 rounded-2xl transition-all duration-300 overflow-hidden',
        'hover:scale-105 hover:-translate-y-1 hover:shadow-xl',
        'active:scale-95 active:translate-y-0',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        'transform-gpu', // Enable GPU acceleration
        selected && 'ring-4 ring-offset-2 shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0'
      )}
      style={{
        backgroundColor: selected ? MOOD_COLOR[label] + '30' : 'white',
        borderColor: MOOD_COLOR[label],
        borderWidth: '2px',
        // @ts-ignore - CSS custom property
        '--tw-ring-color': MOOD_COLOR[label],
      }}
    >
      {/* Ripple effect on press */}
      {isPressed && (
        <span
          className="absolute inset-0 animate-ping opacity-75 rounded-2xl"
          style={{ backgroundColor: MOOD_COLOR[label] }}
        />
      )}

      <span
        className={cn(
          'text-5xl md:text-6xl transition-transform duration-200',
          isPressed && 'scale-125',
          'relative z-10'
        )}
      >
        {MOOD_ICON[label]}
      </span>
      <span className="text-sm font-medium text-gray-700 relative z-10">
        {MOOD_LABEL_DISPLAY_NAME[label]}
      </span>
      <kbd className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded relative z-10">
        {score}
      </kbd>
    </button>
  );
}
