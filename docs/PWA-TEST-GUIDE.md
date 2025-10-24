# PWA機能テストガイド

## 概要

MoodTapのPWA（Progressive Web App）機能が正常に動作することを確認するためのテストガイドです。

## 前提条件

- 本番ビルドが完了していること
- 本番サーバーが起動していること（`npm start`）
- モダンブラウザ（Chrome, Edge, Safari, Firefox）を使用

## テスト手順

### 1. 本番ビルドとサーバー起動

```bash
# 本番ビルド実行
npm run build

# 本番サーバー起動
npm start
```

ビルド時に以下のログが表示されることを確認：
```
✓ (pwa) Compiling for client (static)...
○ (pwa) Service worker: c:\Users\mitoi\Desktop\Projects\mood-tap\public\sw.js
○ (pwa)   URL: /sw.js
○ (pwa)   Scope: /
```

### 2. Service Worker登録確認

1. ブラウザで `http://localhost:3000` を開く
2. DevTools を開く（F12 または Cmd+Option+I）
3. **Application** タブを開く
4. 左メニューから **Service Workers** を選択

**確認ポイント:**
- ✅ Service Workerが登録されている
- ✅ Status: "activated and is running"
- ✅ Source: `sw.js`

### 3. マニフェスト確認

DevToolsの **Application** タブで：
1. 左メニューから **Manifest** を選択

**確認ポイント:**
- ✅ Name: "MoodTap - 1タップ気分記録"
- ✅ Short name: "MoodTap"
- ✅ Start URL: "/"
- ✅ Theme color: "#3B82F6"
- ✅ Icons: 8つのサイズ（72px〜512px）が表示される

### 4. PWAインストール可能性テスト

#### Chromeでのテスト:
1. アドレスバー右側の **インストール** アイコンをクリック
2. または、右上メニュー → **アプリをインストール**

**確認ポイント:**
- ✅ インストールプロンプトが表示される
- ✅ アプリ名とアイコンが正しく表示される
- ✅ インストール後、スタンドアロンモードで起動する

#### モバイル（iOS/Android）でのテスト:

**iOS Safari:**
1. 共有メニューを開く
2. "ホーム画面に追加" を選択
3. アイコンと名前を確認してインストール

**Android Chrome:**
1. メニューを開く
2. "ホーム画面に追加" を選択
3. アイコンと名前を確認してインストール

### 5. オフライン機能テスト

1. アプリを通常通り開く
2. DevTools → **Network** タブ
3. **Offline** チェックボックスをONにする
4. ページをリロード（Cmd/Ctrl+R）

**確認ポイント:**
- ✅ オフラインでもページが表示される
- ✅ キャッシュされたアセットが読み込まれる
- ✅ 気分記録機能が動作する（IndexedDBに保存）

### 6. キャッシュ確認

DevTools **Application** → **Cache Storage** で：

**確認ポイント:**
- ✅ workbox-precache が存在
- ✅ HTML, CSS, JSファイルがキャッシュされている
- ✅ 画像・アイコンがキャッシュされている

### 7. アイコン表示確認

DevTools **Application** → **Manifest** → **Icons** で：

**確認ポイント:**
- ✅ 全8サイズのアイコンがプレビュー表示される
- ✅ スマイルフェイスデザインが表示される
- ✅ グラデーション背景が正しく表示される

## トラブルシューティング

### Service Workerが登録されない

**原因:** 開発サーバーで実行している
**解決策:**
```bash
# 必ず本番ビルドを使用
npm run build
npm start
```

### PWAインストールボタンが表示されない

**原因:**
- HTTPSでない（localhostは除外）
- マニフェストに問題がある
- Service Workerが登録されていない

**解決策:**
1. DevTools Consoleでエラーを確認
2. Lighthouseで PWA 監査を実行
3. マニフェストの構文を確認

### オフラインで動作しない

**原因:** Service Workerのキャッシュ戦略

**解決策:**
1. DevTools → Application → Service Workers
2. "Update on reload" をチェック
3. "Unregister" → ページリロード → 再登録

## Lighthouse PWA監査

完全な PWA 準拠を確認：

1. DevTools → **Lighthouse** タブ
2. Categories: **Progressive Web App** を選択
3. **Analyze page load** をクリック

**目標スコア:**
- ✅ PWA: 90点以上
- ✅ Installable
- ✅ PWA-optimized
- ✅ Works offline

## テスト完了チェックリスト

- [ ] 本番ビルド成功
- [ ] Service Worker登録確認
- [ ] マニフェスト正常表示
- [ ] PWAインストール可能
- [ ] オフラインで動作
- [ ] アイコン正常表示
- [ ] キャッシュ動作確認
- [ ] Lighthouse PWA スコア 90+

## 本番環境での追加テスト

Vercelなどにデプロイ後：
- [ ] HTTPS環境でPWA動作
- [ ] モバイル実機でインストール
- [ ] ホーム画面アイコン表示
- [ ] スタンドアロンモード起動
- [ ] プッシュ通知権限（将来実装）

---

**作成日:** 2025-10-24
**バージョン:** 1.0
**対象フェーズ:** Phase 7 - PWA Configuration
