# MoodTap デプロイメントガイド

このドキュメントでは、MoodTapアプリケーションをVercelにデプロイする手順を説明します。

---

## 前提条件

- ✅ GitHubアカウント
- ✅ Vercelアカウント（無料プランでOK）
- ✅ ローカルでの本番ビルドが成功していること

---

## デプロイ手順

### ステップ1: GitHubリポジトリの確認

すでにこのプロジェクトはGitHubにプッシュされていますので、次のステップに進みます。

もし新しいリポジトリにプッシュする場合：

```bash
# リモートリポジトリを設定
git remote set-url origin https://github.com/yourusername/mood-tap.git

# プッシュ
git push -u origin master
```

### ステップ2: Vercelプロジェクトの作成

1. **Vercelにアクセス**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **新規プロジェクトのインポート**
   - ダッシュボードから「Add New...」→「Project」をクリック
   - GitHubリポジトリを検索して「mood-tap」を選択
   - 「Import」をクリック

3. **プロジェクト設定**

   Vercelが自動的に以下を検出します：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

   これらの設定はそのままでOKです。

4. **環境変数の設定**

   現在、このアプリケーションは環境変数を必要としません（完全にローカルストレージで動作）。

   「Environment Variables」セクションは空のままで大丈夫です。

5. **デプロイ実行**
   - 「Deploy」ボタンをクリック
   - ビルドプロセスが開始されます（通常1-3分）
   - 完了すると、デプロイURLが表示されます

### ステップ3: デプロイの確認

デプロイが完了したら、以下を確認してください：

1. **本番URLにアクセス**
   - `https://your-project-name.vercel.app` を開く

2. **動作確認**
   - [ ] ページが正常に表示される
   - [ ] 気分記録が正常に動作する
   - [ ] カレンダーが表示される
   - [ ] 統計ページが動作する
   - [ ] オフラインモードが機能する（DevToolsでネットワークをオフに）

3. **PWA機能の確認**
   - [ ] ホーム画面に追加できる
   - [ ] Service Workerが登録されている（DevTools > Application > Service Workers）
   - [ ] マニフェストが正しく読み込まれている（DevTools > Application > Manifest）

---

## 継続的デプロイメント（自動デプロイ）

Vercelは自動的に継続的デプロイメントを設定します：

### 本番デプロイ
- `master`ブランチにプッシュすると自動的に本番環境にデプロイ
- URL: `https://your-project-name.vercel.app`

### プレビューデプロイ
- Pull Requestを作成すると、自動的にプレビュー環境を作成
- URL: `https://your-project-name-git-branch-name.vercel.app`

---

## パフォーマンス最適化の確認

### Lighthouse監査

1. **Chrome DevToolsを開く**
   - F12キーまたは右クリック > 検証

2. **Lighthouseタブを選択**
   - Categories: Performance, Accessibility, Best Practices, SEO, PWA
   - Device: Desktop または Mobile
   - 「Analyze page load」をクリック

3. **目標スコア**
   - ✅ Performance: 90点以上
   - ✅ Accessibility: 95点以上
   - ✅ Best Practices: 90点以上
   - ✅ SEO: 90点以上
   - ✅ PWA: Installable

### Web Vitals

Vercel Analyticsで以下を監視：
- **LCP (Largest Contentful Paint)**: 2.5秒以内
- **FID (First Input Delay)**: 100ms以内
- **CLS (Cumulative Layout Shift)**: 0.1以下

---

## カスタムドメインの設定（オプション）

### ドメインの購入

推奨レジストラ：
- Namecheap
- Google Domains
- Cloudflare Registrar

例: `moodtap.app`

### Vercelでの設定

1. **Vercel Dashboardを開く**
   - プロジェクトを選択
   - Settings > Domains

2. **ドメインを追加**
   - ドメイン名を入力（例: `moodtap.app`）
   - 「Add」をクリック

3. **DNS設定**

   Vercelが表示する指示に従って、DNSレコードを設定：

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **SSL証明書**
   - Vercelが自動的にSSL証明書を発行（Let's Encrypt）
   - HTTPSが自動的に有効になります

---

## モニタリングと分析

### Vercel Analytics（推奨）

1. **有効化**
   - Vercel Dashboard > Analytics
   - 「Enable Analytics」をクリック

2. **確認できる項目**
   - リアルタイムユーザー数
   - ページビュー
   - Web Vitals
   - トップページ
   - トップリファラー

### Google Analytics（オプション）

将来的に追加する場合：

```typescript
// app/layout.tsx に追加
import Script from 'next/script';

export default function RootLayout() {
  return (
    <html lang="ja">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## トラブルシューティング

### ビルドエラー

**症状:**
```
Error: Module not found
```

**解決策:**
```bash
# ローカルでビルドテスト
npm run build

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### デプロイは成功するが、ページが表示されない

**確認事項:**
1. Vercelのデプロイログを確認
2. ブラウザのコンソールでエラーを確認
3. Next.jsのバージョンとVercelの互換性を確認

### Service Workerが動作しない

**原因:**
- HTTPSが必要（VercelはデフォルトでHTTPS）

**解決策:**
1. HTTPSでアクセスしているか確認
2. ブラウザのキャッシュをクリア
3. 再度アクセス

### PWAとしてインストールできない

**確認事項:**
- [ ] manifest.jsonが正しく配信されている
- [ ] Service Workerが登録されている
- [ ] HTTPSでアクセスしている
- [ ] 最低限のPWA要件を満たしている

---

## セキュリティチェックリスト

デプロイ前に確認：

- [ ] `.env.local`が`.gitignore`に含まれている
- [ ] APIキーや秘密情報がコードに含まれていない
- [ ] 適切なCORS設定（将来的にAPI追加時）
- [ ] セキュリティヘッダーの設定（将来的に）

### セキュリティヘッダーの追加（推奨）

`next.config.ts` に追加：

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## ロールバック手順

問題が発生した場合の対処法：

### 1. Vercel Dashboardからロールバック

1. Vercel Dashboard > Deployments
2. 正常に動作していたデプロイメントを選択
3. 「...」メニュー > 「Promote to Production」

### 2. Gitで前のコミットに戻す

```bash
# 前のコミットに戻る
git revert HEAD
git push origin master

# または特定のコミットに戻る
git revert <commit-hash>
git push origin master
```

---

## 今後の拡張予定

将来的に必要になる可能性のある設定：

### データベース接続（Phase 2）

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 認証（Phase 2）

```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://moodtap.app
```

### メール通知（Phase 3）

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## まとめ

MoodTapのデプロイは非常にシンプルです：

1. ✅ GitHubにプッシュ
2. ✅ Vercelでインポート
3. ✅ デプロイボタンをクリック

環境変数の設定は不要で、すぐに本番環境で動作します。

---

## サポート

デプロイに問題がある場合：

- Vercel公式ドキュメント: https://vercel.com/docs
- Next.js公式ドキュメント: https://nextjs.org/docs
- GitHub Issues: プロジェクトのIssuesで質問

---

**デプロイ日**: 2025年10月24日
**バージョン**: 1.0.0
**ステータス**: ✅ 本番デプロイ準備完了
