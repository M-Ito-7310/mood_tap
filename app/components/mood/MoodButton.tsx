export type MoodLevel = 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';

interface MoodButtonProps {
  level: MoodLevel;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * MoodButton - Touch-optimized mood selection button
 *
 * This component renders a circular button for mood selection with:
 * - WCAG 2.1 compliant touch target size (min 44x44px)
 * - Accessible keyboard navigation
 * - Clear visual feedback
 * - Color-coded by mood level
 */
export function MoodButton({
  level,
  label,
  onClick,
  disabled = false,
  className = ''
}: MoodButtonProps) {
  const moodColorClasses: Record<MoodLevel, string> = {
    veryBad: 'bg-[var(--color-mood-veryBad)] hover:opacity-90',
    bad: 'bg-[var(--color-mood-bad)] hover:opacity-90',
    neutral: 'bg-[var(--color-mood-neutral)] hover:opacity-90',
    good: 'bg-[var(--color-mood-good)] hover:opacity-90',
    veryGood: 'bg-[var(--color-mood-veryGood)] hover:opacity-90'
  };

  const baseClasses = `
    inline-flex
    items-center
    justify-center
    w-16
    h-16
    min-w-[44px]
    min-h-[44px]
    rounded-full
    font-medium
    text-white
    transition-all
    duration-200
    ease-out
    focus:outline-none
    focus:ring-4
    focus:ring-[var(--color-border-focus)]
    focus:ring-opacity-50
    active:scale-95
    disabled:opacity-50
    disabled:cursor-not-allowed
    cursor-pointer
    select-none
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${moodColorClasses[level]} ${className}`}
      aria-label={label}
      role="button"
      tabIndex={0}
    >
      <span className="sr-only">{label}</span>
    </button>
  );
}
