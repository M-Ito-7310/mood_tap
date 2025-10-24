/**
 * IndexedDB Setup with Dexie.js
 * MoodTap データベース定義
 */

import Dexie, { Table } from 'dexie';
import { MoodEntry } from '@/types/mood';

/**
 * MoodTap Database Class
 * @extends Dexie
 */
export class MoodTapDatabase extends Dexie {
  // テーブル定義
  moodEntries!: Table<MoodEntry, string>;

  constructor() {
    super('MoodTapDB');

    // データベーススキーマ定義
    // version 1: 初期スキーマ
    this.version(1).stores({
      // moodEntries テーブル
      // プライマリキー: id
      // インデックス: date, moodScore, moodLabel, createdAt
      moodEntries: 'id, date, moodScore, moodLabel, createdAt',
    });
  }
}

// シングルトンインスタンス
export const db = new MoodTapDatabase();

/**
 * データベース初期化チェック
 * アプリケーション起動時に呼び出す
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // データベースが開けるか確認
    await db.open();
    console.log('✅ IndexedDB initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize IndexedDB:', error);
    return false;
  }
}

/**
 * データベースをクリア（開発用）
 */
export async function clearDatabase(): Promise<void> {
  try {
    await db.moodEntries.clear();
    console.log('🗑️ Database cleared');
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
}

/**
 * データベース統計情報を取得（デバッグ用）
 */
export async function getDatabaseStats() {
  try {
    const count = await db.moodEntries.count();
    const size = await navigator.storage?.estimate();

    return {
      entryCount: count,
      estimatedUsage: size?.usage,
      estimatedQuota: size?.quota,
    };
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return null;
  }
}
