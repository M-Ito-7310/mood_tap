'use client';

import { MoodEntry, MOOD_COLOR, MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { formatDateWithWeekday } from '@/lib/utils';

interface MoodEntryDetailModalProps {
  entry: MoodEntry | null;
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

export function MoodEntryDetailModal({
  entry,
  date,
  isOpen,
  onClose,
}: MoodEntryDetailModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            {formatDateWithWeekday(date)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {entry ? (
          <>
            {/* 気分情報 */}
            <div
              className="rounded-xl p-6 mb-4"
              style={{
                backgroundColor: MOOD_COLOR[entry.moodLabel] + '20',
                borderLeft: `4px solid ${MOOD_COLOR[entry.moodLabel]}`,
              }}
            >
              <div className="flex items-center gap-4">
                <span className="text-6xl" role="img" aria-label={entry.moodLabel}>
                  {MOOD_ICON[entry.moodLabel]}
                </span>
                <div>
                  <div className="text-sm text-gray-600 mb-1">気分</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {MOOD_LABEL_DISPLAY_NAME[entry.moodLabel]}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    スコア: {entry.moodScore}/5
                  </div>
                </div>
              </div>
            </div>

            {/* メモ */}
            {entry.note && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">メモ</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                  {entry.note}
                </div>
              </div>
            )}

            {/* メタ情報 */}
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">記録日時:</span>
                <span>{new Date(entry.createdAt).toLocaleString('ja-JP')}</span>
              </div>
              {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">更新日時:</span>
                  <span>{new Date(entry.updatedAt).toLocaleString('ja-JP')}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-4">この日の記録はまだありません</p>
            <p className="text-sm text-gray-500">
              ホーム画面から気分を記録できます
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
