'use client';

import { useState, useEffect } from 'react';
import { MoodEntry } from '@/types/mood';
import { initializeDatabase } from '@/lib/db';
import { migrateFromLocalStorage } from '@/lib/migration';
import {
  getAllMoodEntries,
  saveMoodEntry,
  deleteMoodEntry as deleteMoodEntryFromDB,
  deleteAllMoodEntries,
  getMoodEntryByDate as getMoodEntryByDateFromDB,
  getMoodEntriesInRange as getMoodEntriesInRangeFromDB,
} from '@/lib/storage';
import { logError, getErrorMessage } from '@/lib/offline';

/**
 * 気分エントリーを管理するカスタムフック
 * IndexedDB + Dexie.js使用
 */
export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    initializeAndLoad();
  }, []);

  /**
   * データベース初期化とデータロード
   */
  const initializeAndLoad = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // IndexedDB初期化
      await initializeDatabase();

      // localStorageからのマイグレーション
      const migrationResult = await migrateFromLocalStorage();
      if (!migrationResult.success) {
        console.warn('Migration had errors:', migrationResult.errors);
      }

      // データロード
      await loadEntries();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'useMoodEntries.initializeAndLoad');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * IndexedDBからエントリーを読み込み
   */
  const loadEntries = async () => {
    try {
      const allEntries = await getAllMoodEntries('desc');
      setEntries(allEntries);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'useMoodEntries.loadEntries');
      throw err;
    }
  };

  /**
   * エントリーを保存
   */
  const saveEntry = async (entry: MoodEntry): Promise<boolean> => {
    try {
      await saveMoodEntry(entry);
      await loadEntries(); // データを再読み込み
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'useMoodEntries.saveEntry');
      return false;
    }
  };

  /**
   * エントリーを削除
   */
  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      await deleteMoodEntryFromDB(id);
      await loadEntries(); // データを再読み込み
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'useMoodEntries.deleteEntry');
      return false;
    }
  };

  /**
   * 日付でエントリーを取得
   */
  const getEntryByDate = async (date: string): Promise<MoodEntry | undefined> => {
    try {
      return await getMoodEntryByDateFromDB(date);
    } catch (err) {
      logError(err, 'useMoodEntries.getEntryByDate');
      return undefined;
    }
  };

  /**
   * 日付範囲でエントリーを取得
   */
  const getEntriesInRange = async (
    startDate: string,
    endDate: string
  ): Promise<MoodEntry[]> => {
    try {
      return await getMoodEntriesInRangeFromDB(startDate, endDate);
    } catch (err) {
      logError(err, 'useMoodEntries.getEntriesInRange');
      return [];
    }
  };

  /**
   * すべてのエントリーをクリア
   */
  const clearAllEntries = async (): Promise<boolean> => {
    try {
      await deleteAllMoodEntries();
      await loadEntries(); // データを再読み込み
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logError(err, 'useMoodEntries.clearAllEntries');
      return false;
    }
  };

  return {
    entries,
    isLoading,
    error,
    saveEntry,
    deleteEntry,
    getEntryByDate,
    getEntriesInRange,
    clearAllEntries,
    reload: loadEntries,
  };
}
