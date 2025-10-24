/**
 * Data Migration System
 * localStorageからIndexedDBへのデータ移行
 */

import { MoodEntry } from '@/types/mood';
import { bulkImportMoodEntries, getMoodEntryCount } from './storage';

const LEGACY_STORAGE_KEY = 'moodtap_entries';
const MIGRATION_FLAG_KEY = 'moodtap_migration_completed';

/**
 * マイグレーションが必要かチェック
 * @returns マイグレーションが必要な場合はtrue
 */
export function needsMigration(): boolean {
  // 既にマイグレーション済みの場合
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === 'true') {
    return false;
  }

  // localStorageにデータが存在するかチェック
  const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
  return legacyData !== null && legacyData.length > 0;
}

/**
 * localStorageからデータを取得
 * @returns MoodEntry[] | null
 */
function getLegacyData(): MoodEntry[] | null {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn('Legacy data is not an array');
      return null;
    }

    return parsed as MoodEntry[];
  } catch (error) {
    console.error('Failed to parse legacy data:', error);
    return null;
  }
}

/**
 * データをバリデーション
 * @param entries - MoodEntry[]
 * @returns バリデーション済みのMoodEntry[]
 */
function validateEntries(entries: MoodEntry[]): MoodEntry[] {
  return entries.filter((entry) => {
    // 必須フィールドのチェック
    if (!entry.id || !entry.date || !entry.moodScore || !entry.moodLabel) {
      console.warn('Invalid entry found, skipping:', entry);
      return false;
    }

    // moodScoreが1-5の範囲内かチェック
    if (entry.moodScore < 1 || entry.moodScore > 5) {
      console.warn('Invalid moodScore, skipping:', entry);
      return false;
    }

    return true;
  });
}

/**
 * localStorageからIndexedDBへデータを移行
 * @returns 移行したエントリー数
 */
export async function migrateFromLocalStorage(): Promise<{
  success: boolean;
  migratedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    // マイグレーションが必要かチェック
    if (!needsMigration()) {
      console.log('ℹ️ Migration not needed');
      return { success: true, migratedCount: 0, errors: [] };
    }

    console.log('🔄 Starting migration from localStorage to IndexedDB...');

    // localStorageからデータを取得
    const legacyData = getLegacyData();
    if (!legacyData || legacyData.length === 0) {
      console.log('ℹ️ No legacy data found');
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
      return { success: true, migratedCount: 0, errors: [] };
    }

    console.log(`📦 Found ${legacyData.length} entries in localStorage`);

    // データをバリデーション
    const validEntries = validateEntries(legacyData);
    console.log(`✅ ${validEntries.length} valid entries`);

    if (validEntries.length !== legacyData.length) {
      const invalidCount = legacyData.length - validEntries.length;
      errors.push(`${invalidCount} invalid entries were skipped`);
    }

    // IndexedDBにインポート
    if (validEntries.length > 0) {
      try {
        await bulkImportMoodEntries(validEntries);
        console.log(`✅ Migrated ${validEntries.length} entries to IndexedDB`);
      } catch (error) {
        console.error('Failed to import to IndexedDB:', error);
        errors.push('Failed to import data to IndexedDB');
        return { success: false, migratedCount: 0, errors };
      }
    }

    // マイグレーション完了フラグを設定
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

    // 検証: IndexedDBのデータ数を確認
    const dbCount = await getMoodEntryCount();
    console.log(`🔍 Verification: IndexedDB has ${dbCount} entries`);

    console.log('✅ Migration completed successfully');

    return {
      success: true,
      migratedCount: validEntries.length,
      errors,
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return { success: false, migratedCount: 0, errors };
  }
}

/**
 * localStorageのレガシーデータを削除
 * ⚠️ 注意: マイグレーション完了後のみ実行すること
 */
export function cleanupLegacyData(): boolean {
  try {
    // マイグレーション完了フラグを確認
    if (localStorage.getItem(MIGRATION_FLAG_KEY) !== 'true') {
      console.warn('⚠️ Cannot cleanup: migration not completed');
      return false;
    }

    localStorage.removeItem(LEGACY_STORAGE_KEY);
    console.log('🗑️ Legacy data cleaned up');
    return true;
  } catch (error) {
    console.error('Failed to cleanup legacy data:', error);
    return false;
  }
}

/**
 * マイグレーション状態をリセット（開発/テスト用）
 */
export function resetMigrationFlag(): void {
  localStorage.removeItem(MIGRATION_FLAG_KEY);
  console.log('🔄 Migration flag reset');
}

/**
 * マイグレーション情報を取得
 */
export function getMigrationInfo(): {
  migrationCompleted: boolean;
  hasLegacyData: boolean;
  legacyDataCount: number;
} {
  const migrationCompleted = localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
  const legacyData = getLegacyData();
  const hasLegacyData = legacyData !== null && legacyData.length > 0;
  const legacyDataCount = legacyData?.length || 0;

  return {
    migrationCompleted,
    hasLegacyData,
    legacyDataCount,
  };
}
