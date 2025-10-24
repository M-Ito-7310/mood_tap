'use client';

import { useState } from 'react';
import { MoodEntry } from '@/types/mood';
import { downloadCSV, downloadJSON } from '@/lib/export';
import { toISODate } from '@/lib/utils';

interface ExportButtonProps {
  entries: MoodEntry[];
}

export function ExportButton({ entries }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);

    const filename = `moodtap-export-${toISODate(new Date())}.csv`;
    downloadCSV(entries, filename);

    setTimeout(() => setIsExporting(false), 1000);
  };

  const handleExportJSON = () => {
    setIsExporting(true);

    const filename = `moodtap-export-${toISODate(new Date())}.json`;
    downloadJSON(entries, filename);

    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleExportCSV}
        disabled={isExporting || entries.length === 0}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? 'エクスポート中...' : 'CSV形式でエクスポート'}
      </button>

      <button
        onClick={handleExportJSON}
        disabled={isExporting || entries.length === 0}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? 'エクスポート中...' : 'JSON形式でエクスポート'}
      </button>

      {entries.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          エクスポートできるデータがありません
        </p>
      )}
    </div>
  );
}
