# Phase 11: データベース移行準備

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 45-60分
**実績時間**: -
**依存**: Phase 1-10完了
**優先度**: Low
**開始日時**: -
**完了日時**: -

## 📋 概要

Neon PostgreSQL + Drizzle ORMの設定を行い、将来のマルチユーザー対応への準備を整えます。

## ✅ タスクチェックリスト

- [ ] Neonアカウント作成（https://neon.tech）
- [ ] 新規プロジェクト作成（moodtap）
- [ ] drizzle-orm、@neondatabase/serverless、drizzle-kitインストール
- [ ] .env.local作成：DATABASE_URL設定
- [ ] drizzle.config.ts作成：Drizzle ORM設定
- [ ] lib/db/schema.ts作成：スキーマ定義（users、moodEntries）
- [ ] lib/db/client.ts作成：DB接続設定
- [ ] マイグレーション実行（npm run db:push）
- [ ] Drizzle Studioで確認

## 📦 成果物

- [ ] .env.local（DATABASE_URL）
- [ ] drizzle.config.ts
- [ ] lib/db/schema.ts
- [ ] lib/db/client.ts

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_11-database-migration.md)

## 🎯 完了条件

- [ ] Neonデータベースが作成されている
- [ ] Drizzle ORMがインストールされている
- [ ] スキーマが定義されている
- [ ] マイグレーションが成功する
- [ ] Drizzle Studioでテーブルが確認できる
- [ ] .env.localがgitignoreされている

## 📝 メモ・進捗コメント

### 実装開始前
- このPhaseではDB設定のみ、実際のデータ移行は将来実装
- LocalStorageを継続使用（Phase 2以降で完全移行）

## ⚠️ 注意事項・リスク

- .env.localは絶対にGitにコミットしないこと
- DATABASE_URLは環境変数で管理
- Neon無料枠：1プロジェクト、10GB

## 🧪 テスト項目

- [ ] DATABASE_URLが正しく設定されている
- [ ] npm run db:generateが成功する
- [ ] npm run db:pushが成功する
- [ ] Drizzle Studioでテーブルが見える
