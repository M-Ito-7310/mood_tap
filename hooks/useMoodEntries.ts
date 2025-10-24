'use client';

import { useState, useEffect } from 'react';
import { MoodEntry } from '@/types/mood';

const STORAGE_KEY = 'moodtap_entries';

/**
 * 気分エントリーを管理するカスタムフック
 * Phase 4でIndexedDBに移行予定
 */
export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初期ロード
  useEffect(() => {
    loadEntries();
  }, []);

  /**
   * localStorageからエントリーを読み込み
   */
  const loadEntries = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MoodEntry[];
        // 日付の降順でソート (新しい順)
        const sorted = parsed.sort((a, b) => b.date.localeCompare(a.date));
        setEntries(sorted);
      }
    } catch (error) {
      console.error('Failed to load mood entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * エントリーを保存
   */
  const saveEntry = (entry: MoodEntry): boolean => {
    try {
      // 既存のエントリーを検索（同じIDまたは同じ日付）
      const existingIndex = entries.findIndex(
        (e) => e.id === entry.id || e.date === entry.date
      );

      let updatedEntries: MoodEntry[];
      if (existingIndex >= 0) {
        // 更新
        updatedEntries = [...entries];
        updatedEntries[existingIndex] = entry;
      } else {
        // 新規追加
        updatedEntries = [entry, ...entries];
      }

      // 日付の降順でソート
      const sorted = updatedEntries.sort((a, b) => b.date.localeCompare(a.date));

      // localStorageに保存
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      setEntries(sorted);
      return true;
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      return false;
    }
  };

  /**
   * エントリーを削除
   */
  const deleteEntry = (id: string): boolean => {
    try {
      const filtered = entries.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setEntries(filtered);
      return true;
    } catch (error) {
      console.error('Failed to delete mood entry:', error);
      return false;
    }
  };

  /**
   * 日付でエントリーを取得
   */
  const getEntryByDate = (date: string): MoodEntry | undefined => {
    return entries.find((e) => e.date === date);
  };

  /**
   * 日付範囲でエントリーを取得
   */
  const getEntriesInRange = (startDate: string, endDate: string): MoodEntry[] => {
    return entries.filter((e) => e.date >= startDate && e.date <= endDate);
  };

  /**
   * すべてのエントリーをクリア
   */
  const clearAllEntries = (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setEntries([]);
      return true;
    } catch (error) {
      console.error('Failed to clear mood entries:', error);
      return false;
    }
  };

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry,
    getEntryByDate,
    getEntriesInRange,
    clearAllEntries,
    reload: loadEntries,
  };
}
