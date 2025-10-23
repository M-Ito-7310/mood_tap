# Phase 1: プロジェクトセットアップ

**作成日**: 2025年10月23日
**Phase**: 1/12
**所要時間**: 30-45分
**前提条件**: Node.js 18.x以上、Git、VSCode

---

## 目次

1. [Phase概要](#phase概要)
2. [目的と目標](#目的と目標)
3. [技術要件](#技術要件)
4. [実装タスク詳細](#実装タスク詳細)
5. [コード例とコマンド](#コード例とコマンド)
6. [チェックリスト](#チェックリスト)
7. [トラブルシューティング](#トラブルシューティング)
8. [次のPhaseへの接続](#次のphaseへの接続)

---

## Phase概要

### 目的
開発環境を構築し、Next.js 14プロジェクトのベースを確立する。TypeScript、Tailwind CSS、必要なディレクトリ構造をセットアップし、開発の土台を作る。

### 成果物
- Next.js 14プロジェクト (App Router)
- TypeScript設定ファイル
- Tailwind CSS設定ファイル
- 標準化されたディレクトリ構造
- Gitリポジトリ初期化

---

## 目的と目標

### ビジネス目標
- 迅速なプロトタイプ開発の基盤構築
- 型安全性とコード品質の確保
- チーム開発を見据えた構造化

### 技術目標
- **Next.js 14 App Router**: Server ComponentsとClient Componentsの活用
- **TypeScript厳格モード**: 型安全性の最大化
- **Tailwind CSS**: 高速スタイリング環境
- **モジュラー構造**: スケーラブルなディレクトリ設計

---

## 技術要件

### 必須ソフトウェア

| ソフトウェア | バージョン | 用途 |
|------------|----------|------|
| Node.js | 18.x 以上 | JavaScript実行環境 |
| npm/yarn | 最新版 | パッケージ管理 |
| Git | 2.x 以上 | バージョン管理 |
| VSCode | 最新版 (推奨) | エディタ |

### VSCode拡張機能 (推奨)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 実装タスク詳細

### タスク1: Next.jsプロジェクト初期化 (10分)

#### 手順

```bash
# プロジェクトディレクトリ作成
npx create-next-app@latest moodtap --typescript --tailwind --app --no-src

# ディレクトリ移動
cd moodtap
```

#### インタラクティブプロンプトの選択

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

#### 確認コマンド

```bash
# プロジェクト構造確認
ls -la

# package.json確認
cat package.json
```

### タスク2: ディレクトリ構造作成 (10分)

#### 標準ディレクトリ構成

```
moodtap/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── globals.css        # グローバルCSS
│   └── api/               # API Routes (Phase 2以降)
├── components/            # Reactコンポーネント
│   ├── mood/              # 気分記録関連
│   ├── calendar/          # カレンダー関連
│   ├── stats/             # 統計関連
│   └── ui/                # 共通UIコンポーネント
├── lib/                   # ユーティリティ関数
│   ├── utils.ts           # 共通ユーティリティ
│   ├── localStorage.ts    # LocalStorage操作
│   └── db/                # DB関連 (Phase 11)
├── types/                 # TypeScript型定義
│   └── mood.ts            # Mood関連型
├── hooks/                 # カスタムReactフック
├── public/                # 静的ファイル
│   ├── icons/             # PWAアイコン
│   └── manifest.json      # PWAマニフェスト (Phase 9)
└── docs/                  # プロジェクトドキュメント
```

#### 作成コマンド

```bash
# ディレクトリ作成
mkdir -p components/{mood,calendar,stats,ui}
mkdir -p lib/db
mkdir -p types
mkdir -p hooks
mkdir -p public/icons
mkdir -p docs/implementation
```

### タスク3: TypeScript設定 (5分)

#### tsconfig.json更新

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 重要な設定項目

| 設定 | 説明 | 理由 |
|------|------|------|
| `strict: true` | 厳格モード有効化 | 型安全性の最大化 |
| `noImplicitAny: true` | 暗黙のany禁止 | 型推論の強制 |
| `strictNullChecks: true` | null/undefined厳格チェック | ランタイムエラー防止 |
| `noUnusedLocals: true` | 未使用変数検出 | コード品質向上 |

### タスク4: Tailwind CSS設定 (10分)

#### tailwind.config.ts更新

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mood: {
          veryBad: '#EF4444',    // 赤 (😢)
          bad: '#FB923C',        // オレンジ (😟)
          neutral: '#9CA3AF',    // グレー (😐)
          good: '#60A5FA',       // 青 (😊)
          veryGood: '#3B82F6',   // 濃い青 (😄)
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### カスタムカラーパレット説明

```typescript
// 気分スコアとカラーの対応
export const MOOD_COLORS = {
  1: '#EF4444', // 最悪 (Very Bad)
  2: '#FB923C', // 悪い (Bad)
  3: '#9CA3AF', // 普通 (Neutral)
  4: '#60A5FA', // 良い (Good)
  5: '#3B82F6', // 最高 (Very Good)
} as const;
```

### タスク5: Git初期化 (5分)

#### .gitignore作成 (自動生成済み)

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

#### Gitリポジトリ初期化

```bash
# Git初期化
git init

# 初回コミット
git add .
git commit -m "chore: Initial project setup with Next.js 14, TypeScript, Tailwind CSS"
```

---

## コード例とコマンド

### 開発サーバー起動確認

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000
```

### ビルドテスト

```bash
# 本番ビルド
npm run build

# ビルド成功確認
# ✓ Compiled successfully
```

### 型チェック

```bash
# TypeScript型チェック
npx tsc --noEmit

# エラーがない場合は何も表示されない
```

---

## チェックリスト

### 完了基準

- [ ] Next.js 14プロジェクトが`npm run dev`で起動する
- [ ] TypeScript厳格モードが有効化されている
- [ ] Tailwind CSSが正しく動作する (ホームページでクラス適用確認)
- [ ] ディレクトリ構造が標準に従って作成されている
- [ ] Gitリポジトリが初期化されている
- [ ] `npm run build`が成功する
- [ ] `npx tsc --noEmit`でエラーが出ない

### 品質基準

- [ ] VSCode拡張機能がインストールされている
- [ ] ESLint警告が0件
- [ ] package.jsonに必要な依存関係が含まれている

---

## トラブルシューティング

### 問題1: Next.jsインストールエラー

**症状:**
```
npm ERR! code ENOENT
```

**解決策:**
```bash
# npmキャッシュクリア
npm cache clean --force

# 再インストール
npx create-next-app@latest moodtap
```

### 問題2: TypeScriptエラー多数

**症状:**
```
error TS2304: Cannot find name 'React'
```

**解決策:**
```bash
# 型定義パッケージ再インストール
npm install --save-dev @types/react @types/node
```

### 問題3: Tailwind CSSが適用されない

**症状:**
ブラウザでスタイルが反映されない

**解決策:**
```typescript
// app/layout.tsx でglobals.cssがインポートされているか確認
import './globals.css';

// globals.css でTailwindディレクティブが含まれているか確認
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 問題4: ポート3000が使用中

**症状:**
```
Port 3000 is already in use
```

**解決策:**
```bash
# 別ポート指定
npm run dev -- -p 3001

# または既存プロセス終了 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 次のPhaseへの接続

### Phase 2への引き継ぎ事項

1. **準備完了事項**
   - TypeScript厳格モードが有効
   - `types/`ディレクトリが作成済み
   - `lib/`ディレクトリが作成済み

2. **Phase 2で実装する内容**
   - `types/mood.ts`: MoodEntry型定義
   - `lib/utils.ts`: 日付操作ユーティリティ
   - Type Guards (型ガード関数)

3. **依存関係**
   - Phase 2はPhase 1の完了が必須
   - TypeScript設定がPhase 2の型定義に影響

### 確認事項

```bash
# プロジェクト構造確認
tree -L 2 -I node_modules

# 期待される出力:
# moodtap/
# ├── app/
# ├── components/
# ├── lib/
# ├── types/
# ├── hooks/
# ├── public/
# └── package.json
```

---

## まとめ

### 達成した内容
- ✅ Next.js 14プロジェクトのセットアップ
- ✅ TypeScript厳格モードの設定
- ✅ Tailwind CSSカスタマイズ
- ✅ スケーラブルなディレクトリ構造
- ✅ Git初期化

### 次のステップ
Phase 2の詳細ドキュメント `20251023_02-type-definitions.md` を確認し、TypeScript型システムの構築に進んでください。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
