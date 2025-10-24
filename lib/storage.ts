/**
 * Mood Entry Storage Service
 * IndexedDBを使用した気分記録の保存・取得サービス
 */

import { db } from './db';
import { MoodEntry, MoodLabel, MoodScore } from '@/types/mood';

/**
 * 気分エントリーを全て取得
 * @param sortOrder - ソート順序 ('asc' | 'desc')
 * @returns MoodEntry[]
 */
export async function getAllMoodEntries(
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<MoodEntry[]> {
  try {
    const entries = await db.moodEntries.toArray();

    // 日付でソート
    return entries.sort((a, b) => {
      const comparison = a.date.localeCompare(b.date);
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  } catch (error) {
    console.error('Failed to get all mood entries:', error);
    throw error;
  }
}

/**
 * IDで気分エントリーを取得
 * @param id - エントリーID
 * @returns MoodEntry | undefined
 */
export async function getMoodEntryById(id: string): Promise<MoodEntry | undefined> {
  try {
    return await db.moodEntries.get(id);
  } catch (error) {
    console.error(`Failed to get mood entry by id: ${id}`, error);
    throw error;
  }
}

/**
 * 日付で気分エントリーを取得
 * @param date - 日付 (YYYY-MM-DD)
 * @returns MoodEntry | undefined
 */
export async function getMoodEntryByDate(date: string): Promise<MoodEntry | undefined> {
  try {
    return await db.moodEntries.where('date').equals(date).first();
  } catch (error) {
    console.error(`Failed to get mood entry by date: ${date}`, error);
    throw error;
  }
}

/**
 * 日付範囲で気分エントリーを取得
 * @param startDate - 開始日 (YYYY-MM-DD)
 * @param endDate - 終了日 (YYYY-MM-DD)
 * @returns MoodEntry[]
 */
export async function getMoodEntriesInRange(
  startDate: string,
  endDate: string
): Promise<MoodEntry[]> {
  try {
    return await db.moodEntries
      .where('date')
      .between(startDate, endDate, true, true) // 両端を含む
      .sortBy('date');
  } catch (error) {
    console.error(`Failed to get entries in range: ${startDate} - ${endDate}`, error);
    throw error;
  }
}

/**
 * 気分ラベルで気分エントリーを取得
 * @param moodLabel - 気分ラベル
 * @returns MoodEntry[]
 */
export async function getMoodEntriesByLabel(moodLabel: MoodLabel): Promise<MoodEntry[]> {
  try {
    return await db.moodEntries.where('moodLabel').equals(moodLabel).toArray();
  } catch (error) {
    console.error(`Failed to get entries by label: ${moodLabel}`, error);
    throw error;
  }
}

/**
 * 気分スコアで気分エントリーを取得
 * @param moodScore - 気分スコア
 * @returns MoodEntry[]
 */
export async function getMoodEntriesByScore(moodScore: MoodScore): Promise<MoodEntry[]> {
  try {
    return await db.moodEntries.where('moodScore').equals(moodScore).toArray();
  } catch (error) {
    console.error(`Failed to get entries by score: ${moodScore}`, error);
    throw error;
  }
}

/**
 * 気分エントリーを保存（新規作成または更新）
 * @param entry - MoodEntry
 * @returns 保存されたエントリーのID
 */
export async function saveMoodEntry(entry: MoodEntry): Promise<string> {
  try {
    // 同じ日付のエントリーが既に存在するか確認
    const existingEntry = await getMoodEntryByDate(entry.date);

    if (existingEntry) {
      // 更新
      const updatedEntry: MoodEntry = {
        ...existingEntry,
        ...entry,
        updatedAt: new Date().toISOString(),
      };
      await db.moodEntries.put(updatedEntry);
      return updatedEntry.id;
    } else {
      // 新規作成
      await db.moodEntries.add(entry);
      return entry.id;
    }
  } catch (error) {
    console.error('Failed to save mood entry:', error);
    throw error;
  }
}

/**
 * 気分エントリーを更新
 * @param id - エントリーID
 * @param updates - 更新するフィールド
 * @returns 更新されたエントリー
 */
export async function updateMoodEntry(
  id: string,
  updates: Partial<Omit<MoodEntry, 'id'>>
): Promise<MoodEntry | undefined> {
  try {
    const existing = await getMoodEntryById(id);
    if (!existing) {
      throw new Error(`Mood entry not found: ${id}`);
    }

    const updated: MoodEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.moodEntries.put(updated);
    return updated;
  } catch (error) {
    console.error(`Failed to update mood entry: ${id}`, error);
    throw error;
  }
}

/**
 * 気分エントリーを削除
 * @param id - エントリーID
 * @returns 削除成功したか
 */
export async function deleteMoodEntry(id: string): Promise<boolean> {
  try {
    await db.moodEntries.delete(id);
    return true;
  } catch (error) {
    console.error(`Failed to delete mood entry: ${id}`, error);
    throw error;
  }
}

/**
 * 全ての気分エントリーを削除
 * @returns 削除成功したか
 */
export async function deleteAllMoodEntries(): Promise<boolean> {
  try {
    await db.moodEntries.clear();
    return true;
  } catch (error) {
    console.error('Failed to delete all mood entries:', error);
    throw error;
  }
}

/**
 * 気分エントリーの総数を取得
 * @returns エントリー数
 */
export async function getMoodEntryCount(): Promise<number> {
  try {
    return await db.moodEntries.count();
  } catch (error) {
    console.error('Failed to get mood entry count:', error);
    throw error;
  }
}

/**
 * 最新の気分エントリーを取得
 * @param limit - 取得件数
 * @returns MoodEntry[]
 */
export async function getRecentMoodEntries(limit: number = 10): Promise<MoodEntry[]> {
  try {
    const entries = await db.moodEntries.orderBy('date').reverse().limit(limit).toArray();
    return entries;
  } catch (error) {
    console.error('Failed to get recent mood entries:', error);
    throw error;
  }
}

/**
 * 気分エントリーをバルクインポート
 * @param entries - MoodEntry[]
 * @returns インポートされたエントリー数
 */
export async function bulkImportMoodEntries(entries: MoodEntry[]): Promise<number> {
  try {
    await db.moodEntries.bulkAdd(entries);
    return entries.length;
  } catch (error) {
    console.error('Failed to bulk import mood entries:', error);
    throw error;
  }
}

/**
 * 気分エントリーをバルクエクスポート
 * @returns MoodEntry[]
 */
export async function bulkExportMoodEntries(): Promise<MoodEntry[]> {
  try {
    return await db.moodEntries.toArray();
  } catch (error) {
    console.error('Failed to bulk export mood entries:', error);
    throw error;
  }
}
