# Phase 6: カレンダー表示機能

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 90-120分
**実績時間**: -
**依存**: Phase 1-5完了
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

月次カレンダーで気分記録をヒートマップ形式で可視化。日付クリックで詳細表示を実現します。

## ✅ タスクチェックリスト

- [ ] components/calendar/CalendarDay.tsx作成：日付セルコンポーネント
- [ ] components/calendar/MoodCalendar.tsx作成：カレンダーコンポーネント
- [ ] app/calendar/page.tsx作成：カレンダーページ
- [ ] app/calendar/CalendarClient.tsx作成：Client Component
- [ ] ヒートマップカラーリング実装
- [ ] 前月/次月ナビゲーション実装
- [ ] 今日の日付ハイライト
- [ ] カラー凡例表示

## 📦 成果物

- [ ] components/calendar/CalendarDay.tsx
- [ ] components/calendar/MoodCalendar.tsx
- [ ] app/calendar/page.tsx、CalendarClient.tsx

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_06-calendar-display.md)

## 🎯 完了条件

- [ ] 月次カレンダーが表示される
- [ ] 気分記録がヒートマップで可視化される
- [ ] 前月/次月ボタンが動作する
- [ ] 今日の日付がハイライトされる
- [ ] レスポンシブデザインが機能する

## 📝 メモ・進捗コメント

### 実装開始前
- date-fnsのstartOfMonth、endOfMonth、eachDayOfInterval使用
- 7列グリッドレイアウト（日曜～土曜）

## ⚠️ 注意事項・リスク

- 月初の曜日によって空白セルを調整する必要がある
- 日付クリックイベントはPhase 7で詳細実装

## 🧪 テスト項目

- [ ] カレンダーが正しく表示される
- [ ] 記録がある日はカラーで表示される
- [ ] 前月/次月ボタンで月が切り替わる
- [ ] 今日の日付が視覚的に分かる
