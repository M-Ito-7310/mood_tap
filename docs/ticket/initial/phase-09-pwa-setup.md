# Phase 9: PWA対応

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 1-8完了
**優先度**: Medium
**開始日時**: -
**完了日時**: -

## 📋 概要

Progressive Web App (PWA)として動作するよう設定し、オフライン利用とホーム画面追加を可能にします。

## ✅ タスクチェックリスト

- [ ] public/manifest.json作成：PWAマニフェスト
- [ ] next-pwaパッケージインストール
- [ ] next.config.js更新：PWA設定
- [ ] app/layout.tsx更新：metadataにmanifest追加
- [ ] PWAアイコン生成（72, 96, 128, 144, 152, 192, 384, 512px）
- [ ] Service Worker設定
- [ ] オフライン対応確認

## 📦 成果物

- [ ] public/manifest.json
- [ ] public/icons/*（各サイズアイコン）
- [ ] next.config.js（PWA設定）

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_09-pwa-setup.md)

## 🎯 完了条件

- [ ] manifest.jsonが作成されている
- [ ] Service Workerが登録される
- [ ] ホーム画面に追加できる
- [ ] オフライン動作する
- [ ] アイコンが正しく表示される

## 📝 メモ・進捗コメント

### 実装開始前
- アイコン生成ツール：https://www.pwabuilder.com/imageGenerator
- theme_color: #3B82F6

## ⚠️ 注意事項・リスク

- 開発環境ではService Workerを無効化すること
- HTTPSが必須（Vercelは自動対応）

## 🧪 テスト項目

- [ ] Chrome DevToolsでPWAとして認識される
- [ ] ホーム画面に追加できる
- [ ] オフラインでも表示される
- [ ] アイコンが正しく表示される
