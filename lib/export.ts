import { MoodEntry, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';

/**
 * MoodEntryをCSV形式に変換
 */
export function convertToCSV(entries: MoodEntry[]): string {
  // ヘッダー
  const header = ['日付', '気分スコア', '気分', 'メモ', '作成日時'];

  // データ行
  const rows = entries.map((entry) => [
    entry.date,
    entry.moodScore.toString(),
    MOOD_LABEL_DISPLAY_NAME[entry.moodLabel],
    entry.note || '',
    entry.createdAt,
  ]);

  // CSV組み立て
  const csvContent = [
    header.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * CSVファイルをダウンロード
 */
export function downloadCSV(entries: MoodEntry[], filename: string = 'moodtap-export.csv') {
  const csv = convertToCSV(entries);
  const bom = '\uFEFF'; // UTF-8 BOM (Excel対応)
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });

  // ダウンロードリンク作成
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * JSON形式でエクスポート
 */
export function downloadJSON(entries: MoodEntry[], filename: string = 'moodtap-export.json') {
  const json = JSON.stringify(entries, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
