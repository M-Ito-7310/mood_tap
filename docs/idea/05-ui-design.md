# UI/UX Design

## デザインコンセプト

**「極限のシンプルさと、心地よい可視化」**

MoodTapのUI/UXデザインは、以下の3つの原則に基づきます:

1. **ミニマリズム**: 余計な要素を排除し、3秒で完了する体験
2. **感情的共鳴**: 気分を視覚的に表現し、自己理解を促進
3. **習慣化デザイン**: 毎日使いたくなるような心地よいインタラクション

---

## カラーパレット

### 気分スコア別カラー

MoodTapのコアとなる5段階の気分カラーです。

| スコア | ラベル | 絵文字 | カラーコード | Tailwind Class | 心理的効果 |
|-------|-------|-------|------------|---------------|----------|
| 5 | Very Good | 😄 | #3B82F6 | bg-blue-500 | ポジティブ、活力 |
| 4 | Good | 😊 | #60A5FA | bg-blue-400 | 安定、満足感 |
| 3 | Neutral | 😐 | #9CA3AF | bg-gray-400 | 中立、客観性 |
| 2 | Bad | 😔 | #FB923C | bg-orange-400 | 注意喚起、温かみ |
| 1 | Very Bad | 😢 | #EF4444 | bg-red-500 | 警告、共感 |

### ベースカラー

全体的なUIのベースカラーです。

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',  // 背景色
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // メインカラー
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        neutral: {
          50: '#F9FAFB',  // 背景色
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827', // テキストカラー
        },
      },
    },
  },
};
```

---

## タイポグラフィ

### フォント

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

### テキストサイズ

| 用途 | サイズ | Tailwind Class |
|------|-------|---------------|
| H1(ページタイトル) | 36px | text-4xl |
| H2(セクションタイトル) | 24px | text-2xl |
| H3(サブタイトル) | 20px | text-xl |
| ボディテキスト | 16px | text-base |
| キャプション | 14px | text-sm |
| 小さい注釈 | 12px | text-xs |

---

## レイアウト設計

### 1. ランディングページ

#### 構成要素
- **ヒーローセクション**
  - キャッチコピー: 「たった3秒で、心の健康を可視化する」
  - サブコピー: 「1日1回、気分をタップするだけ。カレンダーであなたの心の波を見える化。」
  - CTA ボタン: 「今すぐ始める」(bg-blue-500)

- **機能紹介セクション**
  - カード1: 「1タップで完了」(アイコン: ⏱️)
  - カード2: 「カレンダーで可視化」(アイコン: 📅)
  - カード3: 「オプションメモ」(アイコン: ✍️)

- **デモセクション**
  - 実際の記録画面のスクリーンショット
  - カレンダービューのGIFアニメーション

- **フッター**
  - プライバシーポリシー
  - 利用規約
  - お問い合わせ

#### ワイヤーフレーム

```
+--------------------------------------------------+
|                    Logo                          |
+--------------------------------------------------+
|                                                  |
|        たった3秒で、心の健康を可視化する              |
|    1日1回、気分をタップするだけ。カレンダーで可視化。   |
|                                                  |
|              [今すぐ始める]                        |
|                                                  |
+--------------------------------------------------+
|         [カード1]  [カード2]  [カード3]            |
+--------------------------------------------------+
|                 デモ画面                          |
+--------------------------------------------------+
|                 フッター                          |
+--------------------------------------------------+
```

---

### 2. メインダッシュボード

#### 構成要素

**上部: 日付と統計サマリー**
- 今日の日付(大きく表示)
- 今週の平均気分スコア
- 連続記録日数(ストリーク)

**中央: 気分記録エリア**
- 「今日の気分は?」(タイトル)
- 5段階アイコンボタン(横並び)
- オプションメモ入力欄(折りたたみ可能)

**下部: カレンダービュー**
- 月次カレンダー
- 各日付に気分アイコン表示
- ヒートマップカラー

#### ワイヤーフレーム

```
+--------------------------------------------------+
| 2025年10月23日(水)  今週の平均: 4.2  ストリーク: 15日 |
+--------------------------------------------------+
|                                                  |
|              今日の気分は?                         |
|                                                  |
|    😄    😊    😐    😔    😢                    |
|  [5]   [4]   [3]   [2]   [1]                   |
|                                                  |
|  [メモを追加する]                                  |
|                                                  |
+--------------------------------------------------+
|              10月のカレンダー                      |
|                                                  |
|   日  月  火  水  木  金  土                       |
|   -   -   1😊  2😄  3😐  4😊  5😄                |
|   6😊  7😐  8😔  9😄 10😊 11😄 12😊                |
|  13😐 14😄 15😊 16😐 17😄 18😊 19😐                |
|  20😄 21😊 22😐 23?  24   25   26                |
|  27   28   29   30   31                         |
|                                                  |
+--------------------------------------------------+
```

---

### 3. カレンダー詳細モーダル

日付をクリックすると開くモーダルです。

#### 構成要素
- **日付ヘッダー**: 「2025年10月23日(水)」
- **気分アイコン**: 大きく表示
- **気分スコア**: 「気分: 良い (4/5)」
- **メモ**: 「今日はプレゼンが成功した!」
- **記録時刻**: 「記録時刻: 09:30」
- **編集・削除ボタン**

#### ワイヤーフレーム

```
+----------------------------------+
|  2025年10月23日(水)           [×] |
+----------------------------------+
|                                  |
|              😊                  |
|           気分: 良い (4/5)         |
|                                  |
|  メモ:                            |
|  今日はプレゼンが成功した!           |
|                                  |
|  記録時刻: 09:30                  |
|                                  |
|    [編集]      [削除]             |
|                                  |
+----------------------------------+
```

---

### 4. 統計ページ

気分の傾向を可視化するページです。

#### 構成要素

**週次グラフ**
- 過去7日間の気分スコアを折れ線グラフで表示
- X軸: 日付、Y軸: スコア(1-5)

**月次グラフ**
- 過去30日間の気分スコアを折れ線グラフで表示

**統計サマリー**
- 今週の平均スコア: 4.2
- 今月の平均スコア: 3.8
- 最高の日: 10月23日(5)
- 最低の日: 10月8日(2)
- 連続記録日数: 15日

#### ワイヤーフレーム

```
+--------------------------------------------------+
|                 統計ページ                         |
+--------------------------------------------------+
|               週次トレンド                         |
|                                                  |
|    5 |     •──•                                  |
|    4 |  •──•     •──•                            |
|    3 | •              •                          |
|    2 |                                           |
|    1 |                                           |
|      +────────────────────────                   |
|       17 18 19 20 21 22 23                      |
|                                                  |
+--------------------------------------------------+
|             統計サマリー                           |
|                                                  |
|  今週の平均: 4.2  |  今月の平均: 3.8               |
|  最高の日: 10/23  |  最低の日: 10/8                |
|  連続記録日数: 15日                                |
|                                                  |
+--------------------------------------------------+
```

---

## コンポーネント設計

### 1. MoodIconButton(気分アイコンボタン)

#### Props

```typescript
interface MoodIconButtonProps {
  score: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  label: string;
  color: string;
  onClick: () => void;
  isSelected?: boolean;
}
```

#### デザイン仕様

- **通常状態**:
  - 背景: 白(bg-white)
  - ボーダー: グレー(border-gray-300)
  - 絵文字サイズ: 48px
  - ホバー時: 背景色がほんのり変わる(bg-gray-50)

- **選択状態**:
  - 背景: 気分カラー(例: bg-blue-500)
  - ボーダー: 気分カラー濃い目
  - 絵文字サイズ: 56px(拡大)
  - アニメーション: スケール+バウンス

#### 実装例

```tsx
// components/MoodIconButton.tsx
export function MoodIconButton({
  score,
  emoji,
  label,
  color,
  onClick,
  isSelected = false,
}: MoodIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center',
        'w-20 h-20 rounded-2xl border-2 transition-all duration-300',
        'hover:scale-105 active:scale-95',
        isSelected
          ? `${color} border-${color.replace('bg-', 'border-')} shadow-lg scale-110`
          : 'bg-white border-gray-300 hover:bg-gray-50'
      )}
    >
      <span className={cn('text-4xl', isSelected && 'text-5xl')}>
        {emoji}
      </span>
      <span className="text-xs text-gray-600 mt-1">{label}</span>
    </button>
  );
}
```

---

### 2. MoodCalendar(気分カレンダー)

#### Props

```typescript
interface MoodCalendarProps {
  entries: MoodEntry[]; // 月次の気分記録
  onDateClick: (date: string) => void;
  currentMonth: Date;
}
```

#### デザイン仕様

- **カレンダーグリッド**:
  - 7列×5-6行のグリッドレイアウト
  - 各セルに日付と気分アイコン

- **セルのデザイン**:
  - 記録あり: 背景色が気分カラー、絵文字表示
  - 記録なし: グレー背景、「?」マーク
  - 今日: ボーダーが太い(border-4)

- **ヒートマップ効果**:
  - 気分スコアに応じて背景色の濃さを変える
  - スコア5: 最も濃い青
  - スコア1: 最も濃い赤

#### 実装例

```tsx
// components/MoodCalendar.tsx
export function MoodCalendar({ entries, onDateClick, currentMonth }: MoodCalendarProps) {
  const daysInMonth = getDaysInMonth(currentMonth);
  const entriesMap = new Map(entries.map(e => [e.date, e]));

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* 曜日ヘッダー */}
      {['日', '月', '火', '水', '木', '金', '土'].map(day => (
        <div key={day} className="text-center text-sm font-semibold text-gray-600">
          {day}
        </div>
      ))}

      {/* 日付セル */}
      {daysInMonth.map(date => {
        const entry = entriesMap.get(formatDate(date));
        const isToday = isToday(date);

        return (
          <button
            key={formatDate(date)}
            onClick={() => onDateClick(formatDate(date))}
            className={cn(
              'aspect-square rounded-lg flex flex-col items-center justify-center',
              'transition-all duration-200 hover:scale-105',
              isToday && 'border-4 border-blue-500',
              entry ? getMoodColor(entry.moodScore) : 'bg-gray-100'
            )}
          >
            <span className="text-xs text-gray-700">{getDate(date)}</span>
            <span className="text-2xl">{entry ? getMoodEmoji(entry.moodScore) : '?'}</span>
          </button>
        );
      })}
    </div>
  );
}
```

---

### 3. StatsSummary(統計サマリー)

#### Props

```typescript
interface StatsSummaryProps {
  weeklyAverage: number;
  monthlyAverage: number;
  streak: number;
  bestDay?: { date: string; score: number };
  worstDay?: { date: string; score: number };
}
```

#### デザイン仕様

- **カードレイアウト**:
  - 5つの統計をカード形式で表示
  - 各カードに数値とラベル

- **数値の強調**:
  - 大きなフォント(text-3xl)
  - カラフルな背景グラデーション

---

### 4. MoodNoteInput(メモ入力)

#### Props

```typescript
interface MoodNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}
```

#### デザイン仕様

- **折りたたみ可能**:
  - デフォルトは閉じている
  - 「メモを追加する」ボタンをクリックで展開

- **文字数カウンター**:
  - リアルタイムで残り文字数を表示
  - 100文字に近づくと色が変わる(黄色→赤)

---

## インタラクションデザイン

### 1. 気分記録のフロー

```
ユーザー操作 → アニメーション → フィードバック
```

#### ステップ1: アイコンをタップ
- アニメーション: ボタンがバウンス(scale-110)
- 効果音: 軽快なクリック音(オプション)

#### ステップ2: 記録完了
- アニメーション: 画面上部から緑のチェックマークが降りてくる
- トースト通知: 「気分を記録しました!」
- ハプティクスフィードバック: 軽い振動(モバイル)

#### ステップ3: カレンダー更新
- アニメーション: カレンダーの該当日がフェードイン
- スムーズなスクロール(今日の日付へ)

---

### 2. カレンダーのインタラクション

- **日付ホバー**: セルが少し浮き上がる(shadow-md)
- **日付クリック**: モーダルがスライドイン
- **モーダルクローズ**: スライドアウト

---

### 3. ローディング状態

- **初回ロード**: スケルトンスクリーン
- **データ保存中**: ボタンがスピナーに変わる
- **データ読み込み中**: カレンダーがパルス

---

## レスポンシブデザイン

### ブレイクポイント

```typescript
// Tailwind Breakpoints
const breakpoints = {
  sm: '640px',  // スマホ(横向き)
  md: '768px',  // タブレット
  lg: '1024px', // デスクトップ
  xl: '1280px', // 大画面
};
```

### モバイル最適化

- **気分アイコンボタン**: 横並び5個(スクロール可能)
- **カレンダー**: フルスクリーン表示
- **タップターゲット**: 最小44×44px(Apple HIG準拠)
- **フォントサイズ**: 最小16px(読みやすさ)

---

## アクセシビリティ

### ARIA属性

```tsx
<button
  aria-label="気分スコア5: とても良い"
  aria-pressed={isSelected}
  role="button"
>
  😄
</button>
```

### キーボードナビゲーション

- Tab キー: 気分アイコンをフォーカス移動
- Enter/Space キー: 選択
- Escape キー: モーダルクローズ

### カラーコントラスト

- WCAG AA準拠(コントラスト比4.5:1以上)
- 色覚異常にも配慮(絵文字+テキストラベル)

---

## アニメーション

### Tailwind CSS Transition

```css
/* globals.css */
@layer utilities {
  .transition-mood {
    @apply transition-all duration-300 ease-out;
  }

  .bounce-in {
    animation: bounceIn 0.5s ease-out;
  }
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## まとめ

MoodTapのUI/UXデザインは、「1タップで完了」というコアバリューを最大限に活かすため、以下を重視します:

1. **視覚的明快さ**: 5段階アイコンと色分けで直感的に理解
2. **心地よいアニメーション**: 記録完了時の達成感を演出
3. **レスポンシブ対応**: モバイルファーストで設計
4. **アクセシビリティ**: 誰でも使いやすいユニバーサルデザイン

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
