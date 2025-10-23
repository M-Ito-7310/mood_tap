# Phase 2: 型定義とユーティリティ

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 45-60分
**実績時間**: -
**依存**: Phase 1完了
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

アプリケーション全体で使用するTypeScript型システムを構築し、型安全性を確保します。気分記録データ、ユーティリティ関数の型定義を実装します。

## ✅ タスクチェックリスト

- [ ] types/mood.ts作成：MoodEntry、MoodScore、MoodLabel型定義
- [ ] types/mood.ts：Type Guards実装（isMoodScore、isMoodLabel、isMoodEntry）
- [ ] types/mood.ts：定数定義（MOOD_SCORE_LABEL_MAP、MOOD_COLOR、MOOD_ICON等）
- [ ] lib/utils.ts作成：日付操作関数（formatDateISO、parseDateISO、getTodayISO等）
- [ ] lib/utils.ts：UUID生成関数
- [ ] lib/utils.ts：cn関数（クラス名結合）
- [ ] lib/constants.ts作成：アプリケーション定数（STORAGE_KEY、MAX_NOTE_LENGTH等）
- [ ] date-fnsパッケージインストール
- [ ] npm run type-checkでエラー0件確認

## 📦 成果物

- [ ] types/mood.ts（型定義、Type Guards、定数）
- [ ] lib/utils.ts（ユーティリティ関数）
- [ ] lib/constants.ts（アプリケーション定数）

## 🔗 関連ドキュメント

- [実装ドキュメント](../../implementation/20251023_02-type-definitions.md)

## 🎯 完了条件

- [ ] すべての型定義ファイルが作成されている
- [ ] Type Guardsが正しく動作する
- [ ] date-fnsがインストールされている
- [ ] npm run type-checkでエラーが0件
- [ ] ESLint警告が0件

## 📝 メモ・進捗コメント

### 実装開始前
- MoodScoreはUnion型（1 | 2 | 3 | 4 | 5）で厳格に定義
- Type Guardsは型述語（value is Type）を使用
- date-fnsはdate操作に使用

## ⚠️ 注意事項・リスク

- Type Guardsの戻り値型に必ず「value is Type」を指定すること
- MoodScore型は数値のUnion型なので、文字列からの変換時は必ずType Guardを通すこと

## 🧪 テスト項目

- [ ] isMoodScore(3) === true
- [ ] isMoodScore(6) === false
- [ ] isMoodLabel('good') === true
- [ ] formatDateISO(new Date())がYYYY-MM-DD形式で返される
- [ ] generateUUID()がUUID v4形式の文字列を返す
