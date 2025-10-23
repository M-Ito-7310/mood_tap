# Phase 4: 基本レイアウトとUI

**作成日**: 2025年10月23日
**Phase**: 4/12
**所要時間**: 60-90分
**前提条件**: Phase 1-3完了 (プロジェクトセットアップ、型定義、LocalStorage実装済み)

---

## 目次

1. [Phase概要](#phase概要)
2. [目的と目標](#目的と目標)
3. [技術要件](#技術要件)
4. [実装タスク詳細](#実装タスク詳細)
5. [コード例](#コード例)
6. [チェックリスト](#チェックリスト)
7. [トラブルシューティング](#トラブルシューティング)
8. [次のPhaseへの接続](#次のphaseへの接続)

---

## Phase概要

### 目的
アプリケーションの基本レイアウト、ランディングページ、ダッシュボードを構築。ルーティング、ナビゲーション、共通UIコンポーネントを実装する。

### 成果物
- ランディングページ (`app/page.tsx`)
- ダッシュボードページ (`app/dashboard/page.tsx`)
- ルートレイアウト (`app/layout.tsx`)
- ヘッダー/フッターコンポーネント
- 共通UIコンポーネント (ボタン、カード等)

---

## 目的と目標

### ビジネス目標
- **第一印象の最適化**: シンプルで魅力的なランディングページ
- **直感的な操作**: 説明不要のUI
- **ブランディング**: 一貫したデザイン言語

### 技術目標
- **App Router活用**: Server ComponentsとClient Componentsの適切な分離
- **レスポンシブデザイン**: モバイルファースト
- **アクセシビリティ**: WAI-ARIA準拠
- **パフォーマンス**: 初回ロード高速化

---

## 技術要件

### Next.js App Router
- Server Components (デフォルト)
- Client Components ('use client')
- File-based Routing

### Tailwind CSS
- ユーティリティクラス
- カスタムコンポーネントクラス
- レスポンシブブレークポイント

---

## 実装タスク詳細

### タスク1: ルートレイアウト (15分)

#### ファイル: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp' });

export const metadata: Metadata = {
  title: 'MoodTap - 1タップ気分記録',
  description: '1日1回、気分を5段階でタップするだけ。セルフケアを習慣化するアプリ',
  keywords: 'メンタルヘルス, 気分記録, セルフケア, 習慣化',
  authors: [{ name: 'MoodTap Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="font-sans antialiased bg-background-light min-h-screen">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

#### ファイル: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: 'Inter', sans-serif;
    --font-noto-sans-jp: 'Noto Sans JP', sans-serif;
  }

  body {
    font-family: var(--font-inter), var(--font-noto-sans-jp), sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-mood-veryGood text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors;
  }

  .btn-secondary {
    @apply px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6;
  }
}
```

### タスク2: ランディングページ (25分)

#### ファイル: `app/page.tsx`

```typescript
import Link from 'next/link';
import { MOOD_ICON } from '@/types/mood';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヒーローセクション */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            1タップで気分を記録
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            たった3秒で完了。カレンダーで気分の波を可視化。
          </p>

          {/* 気分アイコンプレビュー */}
          <div className="flex justify-center gap-4 mb-12">
            {Object.values(MOOD_ICON).map((icon, index) => (
              <div
                key={index}
                className="text-5xl animate-bounce-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary">
              今すぐ始める
            </Link>
            <Link href="#features" className="btn-secondary">
              機能を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">3つの特徴</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 特徴1 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold mb-3">3秒で完了</h3>
              <p className="text-gray-600">
                気分を5段階のアイコンでタップするだけ。面倒な入力は一切不要。
              </p>
            </div>

            {/* 特徴2 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold mb-3">カレンダー可視化</h3>
              <p className="text-gray-600">
                あなたの気分の波をカレンダーで一目で確認。傾向を把握できます。
              </p>
            </div>

            {/* 特徴3 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-3">プライバシー保護</h3>
              <p className="text-gray-600">
                データは全てあなたのブラウザ内に保存。外部送信は一切ありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2025 MoodTap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
```

### タスク3: ダッシュボードページ (30分)

#### ファイル: `app/dashboard/page.tsx`

```typescript
import { DashboardClient } from './DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}
```

#### ファイル: `app/dashboard/DashboardClient.tsx`

```typescript
'use client';

import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MOOD_ICON, MOOD_LABEL_DISPLAY_NAME } from '@/types/mood';
import { formatDateJP } from '@/lib/utils';

export function DashboardClient() {
  const { entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">あなたの気分記録</p>
        </header>

        {/* 今日の記録セクション */}
        <section className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">今日の気分を記録</h2>
          <p className="text-gray-600">
            気分記録UIはPhase 5で実装します
          </p>
        </section>

        {/* 記録一覧 */}
        <section className="card">
          <h2 className="text-xl font-semibold mb-4">最近の記録</h2>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">まだ記録がありません</p>
              <p className="text-sm">最初の気分を記録してみましょう!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{MOOD_ICON[entry.moodLabel]}</span>
                    <div>
                      <p className="font-medium">{MOOD_LABEL_DISPLAY_NAME[entry.moodLabel]}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateJP(new Date(entry.date))}
                      </p>
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-gray-600 max-w-xs truncate">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

### タスク4: 共通UIコンポーネント (20分)

#### ファイル: `components/ui/Button.tsx`

```typescript
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-mood-veryGood text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### ファイル: `components/ui/Card.tsx`

```typescript
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md p-6', className)}>
      {children}
    </div>
  );
}
```

---

## チェックリスト

### 完了基準

- [ ] ランディングページが`http://localhost:3000`で表示される
- [ ] ダッシュボードが`http://localhost:3000/dashboard`で表示される
- [ ] レスポンシブデザインが動作する (モバイル/デスクトップ)
- [ ] フォントが正しく読み込まれる
- [ ] Tailwind CSSカスタムクラスが動作する
- [ ] ビルドエラーがない (`npm run build`)

---

## トラブルシューティング

### 問題1: フォントが読み込まれない

**解決策:**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 追加
});
```

### 問題2: Tailwindクラスが適用されない

**解決策:**
```bash
# 開発サーバー再起動
npm run dev
```

---

## 次のPhaseへの接続

Phase 5で気分記録UIコンポーネントを実装し、ダッシュボードに統合します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
