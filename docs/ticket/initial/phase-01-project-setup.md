# Phase 1: プロジェクトセットアップ

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: なし
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

Next.js 14をベースにしたMoodTapプロジェクトの開発環境を構築します。TypeScript、Tailwind CSS、date-fnsなどの必要な依存関係をインストールし、プロジェクトの基盤を整えます。このPhaseでは開発サーバーの起動確認まで完了させます。

## ✅ タスクチェックリスト

- [ ] Node.js 18.x以上がインストールされていることを確認
- [ ] npm/yarnがインストールされていることを確認
- [ ] Gitがインストールされていることを確認
- [ ] Next.js 14プロジェクトを初期化（TypeScript、Tailwind CSS、App Router有効化）
- [ ] プロダクション依存パッケージのインストール（date-fns）
- [ ] tsconfig.jsonの厳格な型チェック設定
- [ ] next.config.jsの設定（React Strict Mode）
- [ ] tailwind.config.tsのカスタム設定（気分カラーパレット、アニメーション）
- [ ] .gitignoreの完全版に更新
- [ ] 必要なディレクトリ構造を作成（app、components、lib、types、hooks、public）
- [ ] Gitリポジトリを初期化（git init）
- [ ] 初回コミットを作成
- [ ] npm run devで開発サーバーを起動し、http://localhost:3000で表示確認
- [ ] npm run type-checkでTypeScriptエラーがないことを確認

## 📦 成果物

- [ ] package.json（スクリプト、依存関係が完全に設定されている）
- [ ] tsconfig.json（厳格な型チェック設定）
- [ ] next.config.js（Next.js 14設定）
- [ ] tailwind.config.ts（カスタムテーマ設定：気分カラー定義）
- [ ] postcss.config.js（Tailwind CSS設定）
- [ ] .gitignore（Git除外設定）
- [ ] ディレクトリ構造（app、components、lib、types、hooks、public）

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_01-project-setup.md)

## 🎯 完了条件

- [ ] npm run devでサーバーが正常に起動し、http://localhost:3000でページが表示される
- [ ] npm run type-checkでTypeScriptエラーが0件
- [ ] Tailwind CSSが正しく動作している（カスタムカラーが適用される）
- [ ] Gitリポジトリが初期化され、初回コミットが完了している
- [ ] すべての設定ファイルが正しく配置されている
- [ ] 必要なディレクトリ構造がすべて作成されている

## 📝 メモ・進捗コメント

### 実装開始前
- 実装ドキュメント20251023_01-project-setup.mdを参照
- カスタムカラーパレット：
  - veryBad: #EF4444 (赤)
  - bad: #FB923C (オレンジ)
  - neutral: #9CA3AF (グレー)
  - good: #60A5FA (青)
  - veryGood: #3B82F6 (濃い青)

## ⚠️ 注意事項・リスク

- .env.localファイルは絶対にGitにコミットしないこと（Phase 11で使用）
- Node.jsのバージョンが18.x未満の場合、一部の機能が動作しない可能性がある
- TypeScriptのstrict modeを有効にしているため、Phase 2で型定義を完成させるまでエラーが出る可能性がある
- ポート3000がすでに使用中の場合、PORT=3001 npm run devで別のポートで起動する

## 🧪 テスト項目

- [ ] http://localhost:3000にアクセスしてNext.jsのデフォルトページが表示される
- [ ] ブラウザのコンソールにエラーが表示されない
- [ ] Tailwind CSSのクラス（例: bg-mood-veryGood、text-center）が正しく適用される
- [ ] package.jsonのすべてのスクリプト（dev、build、lint）が実行できる
- [ ] TypeScript型チェックがエラーなく完了する
- [ ] Gitでファイルがコミットできる（git status、git log）
