# Phase 10: データエクスポート

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 1-9完了
**優先度**: Low
**開始日時**: -
**完了日時**: -

## 📋 概要

気分記録データをCSV形式でエクスポートし、カウンセラーとの共有や外部分析を可能にします。

## ✅ タスクチェックリスト

- [ ] lib/export.ts作成：CSV生成関数（convertToCSV、downloadCSV）
- [ ] lib/export.ts：JSON生成関数（downloadJSON）
- [ ] components/settings/ExportButton.tsx作成：エクスポートボタン
- [ ] app/settings/page.tsx作成：設定ページ
- [ ] app/settings/SettingsClient.tsx作成：Client Component
- [ ] UTF-8 BOM対応（Excel互換性）
- [ ] データ統計表示
- [ ] 全データ削除機能

## 📦 成果物

- [ ] lib/export.ts
- [ ] components/settings/ExportButton.tsx
- [ ] app/settings/page.tsx、SettingsClient.tsx

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_10-data-export.md)

## 🎯 完了条件

- [ ] CSV形式でエクスポートできる
- [ ] JSON形式でエクスポートできる
- [ ] ファイルが正しくダウンロードされる
- [ ] Excelで開ける（UTF-8 BOM付き）
- [ ] データ削除機能が動作する

## 📝 メモ・進捗コメント

### 実装開始前
- UTF-8 BOM: \uFEFF
- ファイル名: moodtap-export-YYYY-MM-DD.csv

## ⚠️ 注意事項・リスク

- CSV内のカンマやダブルクォートのエスケープ処理
- 全データ削除時は確認ダイアログ必須

## 🧪 テスト項目

- [ ] CSVファイルがダウンロードされる
- [ ] ExcelでCSVが正しく開ける
- [ ] JSONファイルがダウンロードされる
- [ ] データ削除後にLocalStorageが空になる
