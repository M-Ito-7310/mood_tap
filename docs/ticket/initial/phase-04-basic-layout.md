# Phase 4: 基本レイアウトとUI

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 60-90分
**実績時間**: -
**依存**: Phase 1-3完了
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

アプリケーションの基本レイアウト、ランディングページ、ダッシュボードを構築。ルーティング、ナビゲーション、共通UIコンポーネントを実装します。

## ✅ タスクチェックリスト

- [ ] app/layout.tsx作成：ルートレイアウト、メタデータ、フォント設定
- [ ] app/globals.css更新：カスタムコンポーネントクラス（btn-primary、card等）
- [ ] app/page.tsx作成：ランディングページ（ヒーロー、特徴セクション）
- [ ] app/dashboard/page.tsx作成：Server Component
- [ ] app/dashboard/DashboardClient.tsx作成：Client Component
- [ ] components/ui/Button.tsx作成：共通ボタンコンポーネント
- [ ] components/ui/Card.tsx作成：共通カードコンポーネント
- [ ] Google Fonts (Inter、Noto Sans JP)設定
- [ ] レスポンシブデザイン実装

## 📦 成果物

- [ ] app/layout.tsx（ルートレイアウト）
- [ ] app/page.tsx（ランディングページ）
- [ ] app/dashboard/page.tsx、DashboardClient.tsx
- [ ] components/ui/Button.tsx、Card.tsx

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_04-basic-layout.md)

## 🎯 完了条件

- [ ] ランディングページが表示される
- [ ] ダッシュボードが表示される
- [ ] レスポンシブデザインが機能する（モバイル/デスクトップ）
- [ ] フォントが正しく読み込まれる
- [ ] npm run buildが成功する

## 📝 メモ・進捗コメント

### 実装開始前
- Server ComponentsとClient Componentsを適切に分離
- モバイルファースト設計

## ⚠️ 注意事項・リスク

- 'use client'ディレクティブを適切に配置すること
- フォント読み込みエラーに注意

## 🧪 テスト項目

- [ ] http://localhost:3000でランディングページが表示される
- [ ] http://localhost:3000/dashboardでダッシュボードが表示される
- [ ] モバイルビュー（375px）で正しく表示される
- [ ] タブレットビュー（768px）で正しく表示される
- [ ] デスクトップビュー（1024px以上）で正しく表示される
