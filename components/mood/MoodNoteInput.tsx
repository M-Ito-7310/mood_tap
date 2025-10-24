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
