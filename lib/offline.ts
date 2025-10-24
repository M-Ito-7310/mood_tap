/**
 * Offline Detection & Error Handling
 * オフライン状態の検出とエラーハンドリング
 */

import { useEffect, useState } from 'react';

/**
 * オフライン状態を監視するカスタムフック
 * @returns isOnline - オンライン状態
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('✅ Network connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.warn('⚠️ Network connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * ストレージエラーの種類
 */
export enum StorageErrorType {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * カスタムストレージエラークラス
 */
export class StorageError extends Error {
  type: StorageErrorType;
  originalError?: Error;

  constructor(
    message: string,
    type: StorageErrorType = StorageErrorType.UNKNOWN_ERROR,
    originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
    this.originalError = originalError;

    // スタックトレースを保持
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }
}

/**
 * エラーを分類
 * @param error - Error
 * @returns StorageError
 */
export function classifyError(error: unknown): StorageError {
  if (error instanceof StorageError) {
    return error;
  }

  if (error instanceof Error) {
    // Quota exceeded error
    if (
      error.name === 'QuotaExceededError' ||
      error.message.includes('quota') ||
      error.message.includes('storage')
    ) {
      return new StorageError(
        'ストレージ容量が不足しています。不要なデータを削除してください。',
        StorageErrorType.QUOTA_EXCEEDED,
        error
      );
    }

    // Database error
    if (
      error.name === 'DatabaseError' ||
      error.message.includes('database') ||
      error.message.includes('IndexedDB')
    ) {
      return new StorageError(
        'データベースエラーが発生しました。',
        StorageErrorType.DATABASE_ERROR,
        error
      );
    }

    // Network error
    if (
      error.name === 'NetworkError' ||
      error.message.includes('network') ||
      error.message.includes('fetch')
    ) {
      return new StorageError(
        'ネットワークエラーが発生しました。',
        StorageErrorType.NETWORK_ERROR,
        error
      );
    }

    // Validation error
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return new StorageError(
        'データの検証に失敗しました。',
        StorageErrorType.VALIDATION_ERROR,
        error
      );
    }

    return new StorageError(
      error.message || '不明なエラーが発生しました。',
      StorageErrorType.UNKNOWN_ERROR,
      error
    );
  }

  return new StorageError(
    '不明なエラーが発生しました。',
    StorageErrorType.UNKNOWN_ERROR
  );
}

/**
 * ストレージの使用状況を取得
 * @returns ストレージ使用状況
 */
export async function getStorageUsage(): Promise<{
  usage: number;
  quota: number;
  usagePercentage: number;
  available: number;
} | null> {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      console.warn('Storage API not supported');
      return null;
    }

    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const usagePercentage = quota > 0 ? (usage / quota) * 100 : 0;
    const available = quota - usage;

    return {
      usage,
      quota,
      usagePercentage,
      available,
    };
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    return null;
  }
}

/**
 * ストレージ容量が十分か確認
 * @param requiredBytes - 必要なバイト数
 * @returns 容量が十分な場合はtrue
 */
export async function hasEnoughStorage(requiredBytes: number = 0): Promise<boolean> {
  try {
    const storageInfo = await getStorageUsage();
    if (!storageInfo) {
      // Storage APIが使えない場合は警告のみでtrueを返す
      console.warn('Cannot check storage quota');
      return true;
    }

    const { available, usagePercentage } = storageInfo;

    // 90%以上使用している場合は警告
    if (usagePercentage > 90) {
      console.warn(`⚠️ Storage usage is high: ${usagePercentage.toFixed(2)}%`);
      return false;
    }

    // 必要な容量が確保できるか
    if (requiredBytes > 0 && available < requiredBytes) {
      console.warn(`⚠️ Not enough storage. Required: ${requiredBytes}, Available: ${available}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to check storage quota:', error);
    return true; // エラー時はデフォルトでtrueを返す
  }
}

/**
 * IndexedDBが利用可能かチェック
 * @returns IndexedDBが利用可能な場合はtrue
 */
export function isIndexedDBSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch (error) {
    console.error('Failed to check IndexedDB support:', error);
    return false;
  }
}

/**
 * エラーをユーザーフレンドリーなメッセージに変換
 * @param error - Error
 * @returns ユーザー向けメッセージ
 */
export function getErrorMessage(error: unknown): string {
  const storageError = classifyError(error);

  switch (storageError.type) {
    case StorageErrorType.QUOTA_EXCEEDED:
      return 'ストレージ容量が不足しています。古いデータを削除してください。';
    case StorageErrorType.DATABASE_ERROR:
      return 'データの保存中にエラーが発生しました。再度お試しください。';
    case StorageErrorType.NETWORK_ERROR:
      return 'ネットワークに接続できません。オフラインでも利用可能です。';
    case StorageErrorType.VALIDATION_ERROR:
      return '入力されたデータが正しくありません。';
    default:
      return 'エラーが発生しました。再度お試しください。';
  }
}

/**
 * エラーをログに記録
 * @param error - Error
 * @param context - エラーが発生したコンテキスト
 */
export function logError(error: unknown, context: string): void {
  const storageError = classifyError(error);

  console.error(`[${context}] ${storageError.type}:`, {
    message: storageError.message,
    originalError: storageError.originalError,
    timestamp: new Date().toISOString(),
  });

  // 本番環境では外部エラートラッキングサービスに送信することも可能
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorTracking(storageError, context);
  // }
}
