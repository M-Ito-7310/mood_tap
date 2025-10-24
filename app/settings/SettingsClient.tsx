'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { getDatabaseStats } from '@/lib/db';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeSelector } from '@/components/settings/ThemeSelector';
import { ExportButton } from '@/components/settings/ExportButton';
import { useTheme } from '@/contexts/ThemeContext';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function SettingsClient() {
  const { entries, isLoading, clearAllEntries } = useMoodEntries();
  const { themeGradient } = useTheme();
  const [dbStats, setDbStats] = useState<{
    entryCount: number;
    estimatedUsage?: number;
    estimatedQuota?: number;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // データベース統計を取得
  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true);
      const stats = await getDatabaseStats();
      if (stats) {
        setDbStats(stats);
      }
      setIsLoadingStats(false);
    };
    loadStats();
  }, [entries]);

  const handleClearData = async () => {
    if (
      window.confirm(
        '全ての記録を削除します。この操作は取り消せません。本当によろしいですか?'
      )
    ) {
      const success = await clearAllEntries();
      if (success) {
        window.location.reload();
      }
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeGradient} pb-20`}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <header className="mb-8 animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
            <div className="h-9 bg-white/20 rounded w-24 mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-48"></div>
          </header>

          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} pb-20`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <span className="text-xl mr-2">←</span>
            <span>ホームに戻る</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-600 mt-2">データ管理と設定</p>
        </header>

        <div className="space-y-6">
          {/* データ統計 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              データ統計
            </h2>
            {isLoadingStats ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>総記録数</span>
                  <span className="font-semibold text-blue-600">
                    {entries.length} 件
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>メモ付き記録</span>
                  <span className="font-semibold text-purple-600">
                    {entries.filter((e) => e.note && e.note.trim() !== '').length}{' '}
                    件
                  </span>
                </div>
                {dbStats && (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span>使用ストレージ</span>
                      <span className="font-semibold text-green-600">
                        {formatBytes(dbStats.estimatedUsage)}
                      </span>
                    </div>
                    {dbStats.estimatedQuota && (
                      <div className="flex justify-between py-2">
                        <span>利用可能容量</span>
                        <span className="font-semibold text-gray-500">
                          {formatBytes(dbStats.estimatedQuota)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>

          {/* データエクスポート */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              データエクスポート
            </h2>
            <p className="text-gray-600 mb-6">
              記録したデータをファイルとしてダウンロードできます。
              <br />
              カウンセラーとの共有や外部分析に活用してください。
            </p>
            <ExportButton entries={entries} />
          </section>

          {/* テーマ設定 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              テーマ設定
            </h2>
            <ThemeSelector />
          </section>

          {/* プレースホルダー: 通知設定 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              通知設定
            </h2>
            <p className="text-gray-600 mb-4">
              気分記録のリマインダー通知を設定できます（準備中）
            </p>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-not-allowed opacity-50">
                <span className="text-gray-600">毎日のリマインダー</span>
                <input
                  type="checkbox"
                  disabled
                  className="w-5 h-5 text-blue-600 cursor-not-allowed"
                />
              </label>
            </div>
          </section>

          {/* データ削除 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              危険な操作
            </h2>
            <p className="text-gray-600 mb-6">
              全ての記録を削除します。この操作は取り消せません。
            </p>
            <button
              onClick={handleClearData}
              disabled={entries.length === 0}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              全データを削除
            </button>
            {entries.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-3">
                削除するデータがありません
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
