# Phase 8: 統計・可視化機能

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 60-90分
**実績時間**: -
**依存**: Phase 1-7完了
**優先度**: Medium
**開始日時**: -
**完了日時**: -

## 📋 概要

週次/月次の統計データを算出し、折れ線グラフで可視化。ストリーク(連続記録日数)表示を実装します。

## ✅ タスクチェックリスト

- [ ] lib/stats.ts作成：統計計算関数
- [ ] components/stats/MoodChart.tsx作成：折れ線グラフコンポーネント
- [ ] components/stats/StreakDisplay.tsx作成：ストリーク表示コンポーネント
- [ ] app/stats/page.tsx作成：統計ページ
- [ ] app/stats/StatsClient.tsx作成：Client Component
- [ ] 平均気分スコア計算
- [ ] 週次データ計算
- [ ] ストリーク計算
- [ ] SVGによるグラフ描画

## 📦 成果物

- [ ] lib/stats.ts
- [ ] components/stats/MoodChart.tsx
- [ ] components/stats/StreakDisplay.tsx
- [ ] app/stats/page.tsx、StatsClient.tsx

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_08-stats-visualization.md)

## 🎯 完了条件

- [ ] 週次グラフが表示される
- [ ] ストリークが正しく計算される
- [ ] 統計数値が正確に表示される
- [ ] レスポンシブデザインが機能する

## 📝 メモ・進捗コメント

### 実装開始前
- ストリーク：連続記録日数（今日から遡って計算）
- グラフ：SVGのpolylineとcircleで描画

## ⚠️ 注意事項・リスク

- データが0件の場合のハンドリング
- 週の開始を月曜日とする（ISO 8601）

## 🧪 テスト項目

- [ ] グラフに7日分のデータが表示される
- [ ] ストリークが正しくカウントされる
- [ ] 平均スコアが正確に計算される
- [ ] データが0件でもエラーにならない
