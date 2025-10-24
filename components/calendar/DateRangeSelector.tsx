'use client';

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type DateRangePreset = 'this-week' | 'this-month' | 'last-month' | 'last-3-months' | 'custom';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangeSelectorProps {
  selectedPreset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset, range?: DateRange) => void;
  currentRange?: DateRange;
}

export function DateRangeSelector({
  selectedPreset,
  onPresetChange,
  currentRange,
}: DateRangeSelectorProps) {
  const presets: { value: DateRangePreset; label: string; getRange: () => DateRange }[] = [
    {
      value: 'this-week',
      label: '今週',
      getRange: () => ({
        start: startOfWeek(new Date(), { weekStartsOn: 0 }),
        end: endOfWeek(new Date(), { weekStartsOn: 0 }),
      }),
    },
    {
      value: 'this-month',
      label: '今月',
      getRange: () => ({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      }),
    },
    {
      value: 'last-month',
      label: '先月',
      getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      },
    },
    {
      value: 'last-3-months',
      label: '過去3ヶ月',
      getRange: () => {
        const threeMonthsAgo = subMonths(new Date(), 3);
        return {
          start: startOfMonth(threeMonthsAgo),
          end: endOfMonth(new Date()),
        };
      },
    },
  ];

  const handlePresetClick = (preset: DateRangePreset, getRange?: () => DateRange) => {
    if (getRange) {
      const range = getRange();
      onPresetChange(preset, range);
    } else {
      onPresetChange(preset);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">期間を選択</h3>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value, preset.getRange)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              'border border-gray-200',
              selectedPreset === preset.value
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            )}
            aria-pressed={selectedPreset === preset.value}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {currentRange && selectedPreset !== 'custom' && (
        <div className="mt-3 text-xs text-gray-600">
          {format(currentRange.start, 'yyyy年M月d日', { locale: ja })} 〜{' '}
          {format(currentRange.end, 'yyyy年M月d日', { locale: ja })}
        </div>
      )}
    </div>
  );
}
