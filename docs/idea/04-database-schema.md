# Database Schema

## データベース概要

MoodTapは、Neon PostgreSQLをデータベースとして使用します。ユーザーの気分記録を永続化し、統計分析や長期的なトレンド把握を可能にします。

### 使用技術
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Migration**: Drizzle Kit

---

## Phase 1: MVP段階のデータ管理

### LocalStorage(クライアントサイド)

MVP Phase 1では、**認証機能なし**のため、データはブラウザのLocalStorageに保存します。

#### データ構造

```typescript
// LocalStorageキー
const STORAGE_KEY = 'moodtap_entries';

// データ型定義
interface MoodEntry {
  id: string;                    // UUID
  date: string;                  // ISO 8601形式 (例: "2025-10-23")
  moodScore: 1 | 2 | 3 | 4 | 5;  // 気分スコア
  moodLabel: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good'; // ラベル
  note?: string;                 // オプションメモ(最大100文字)
  createdAt: string;             // 記録時刻(ISO 8601)
  updatedAt?: string;            // 更新時刻(オプション)
}

// LocalStorageに保存されるデータ例
{
  "moodtap_entries": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "date": "2025-10-23",
      "moodScore": 4,
      "moodLabel": "good",
      "note": "今日はプレゼンが成功した!",
      "createdAt": "2025-10-23T09:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "date": "2025-10-22",
      "moodScore": 3,
      "moodLabel": "neutral",
      "createdAt": "2025-10-22T22:15:00.000Z"
    }
  ]
}
```

#### LocalStorage操作関数

```typescript
// lib/localStorage.ts

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getMoodEntries(): MoodEntry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('LocalStorage parse error:', error);
    return [];
  }
}

export function getMoodEntryByDate(date: string): MoodEntry | null {
  const entries = getMoodEntries();
  return entries.find(entry => entry.date === date) || null;
}

export function updateMoodEntry(id: string, updates: Partial<MoodEntry>): void {
  const entries = getMoodEntries();
  const index = entries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

export function deleteMoodEntry(id: string): void {
  const entries = getMoodEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
```

---

## Phase 2: PostgreSQL移行後のスキーマ設計

### テーブル設計

Phase 2で認証機能とデータベースを導入する際のスキーマ設計です。

---

### 1. users テーブル

ユーザーの基本情報を保存します。

#### スキーマ定義

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

#### カラム詳細

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | ユーザー一意識別子 |
| email | VARCHAR(255) | NO | - | メールアドレス(NextAuth認証用) |
| name | VARCHAR(100) | YES | NULL | ユーザー名 |
| avatar_url | TEXT | YES | NULL | プロフィール画像URL |
| created_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 更新日時 |

---

### 2. mood_entries テーブル

気分記録の本体データを保存します。

#### スキーマ定義

```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_score SMALLINT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  mood_label VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date) -- 1日1回の記録制約
);

-- インデックス
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_date ON mood_entries(date DESC);
CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, date DESC);
CREATE INDEX idx_mood_entries_mood_score ON mood_entries(mood_score);
```

#### カラム詳細

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | 記録一意識別子 |
| user_id | UUID | NO | - | ユーザーID(外部キー) |
| date | DATE | NO | - | 記録日付(YYYY-MM-DD) |
| mood_score | SMALLINT | NO | - | 気分スコア(1-5) |
| mood_label | VARCHAR(20) | NO | - | 気分ラベル |
| note | TEXT | YES | NULL | オプションメモ(100文字以内) |
| created_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 更新日時 |

#### 制約
- **UNIQUE(user_id, date)**: 1ユーザー1日1回の記録のみ
- **CHECK(mood_score BETWEEN 1 AND 5)**: スコアは1-5の範囲

---

### 3. mood_labels テーブル(マスターデータ)

気分ラベルのマスターデータです。

#### スキーマ定義

```sql
CREATE TABLE mood_labels (
  id SERIAL PRIMARY KEY,
  score SMALLINT UNIQUE NOT NULL,
  label VARCHAR(20) UNIQUE NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  color VARCHAR(20) NOT NULL,
  description VARCHAR(100)
);

-- 初期データ挿入
INSERT INTO mood_labels (score, label, emoji, color, description) VALUES
  (5, 'very_good', '😄', '#3B82F6', 'とても良い'),
  (4, 'good', '😊', '#60A5FA', '良い'),
  (3, 'neutral', '😐', '#9CA3AF', '普通'),
  (2, 'bad', '😔', '#FB923C', '悪い'),
  (1, 'very_bad', '😢', '#EF4444', 'とても悪い');
```

#### カラム詳細

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | SERIAL | NO | AUTO_INCREMENT | マスターID |
| score | SMALLINT | NO | - | 気分スコア(1-5) |
| label | VARCHAR(20) | NO | - | 気分ラベル(英語) |
| emoji | VARCHAR(10) | NO | - | 絵文字 |
| color | VARCHAR(20) | NO | - | ヒートマップ色 |
| description | VARCHAR(100) | YES | NULL | 日本語説明 |

---

## Drizzle ORM スキーマ定義

### lib/db/schema.ts

```typescript
import { pgTable, uuid, varchar, text, timestamp, date, smallint, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// usersテーブル
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// mood_entriesテーブル
export const moodEntries = pgTable('mood_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  moodScore: smallint('mood_score').notNull(),
  moodLabel: varchar('mood_label', { length: 20 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// mood_labelsテーブル
export const moodLabels = pgTable('mood_labels', {
  id: serial('id').primaryKey(),
  score: smallint('score').notNull().unique(),
  label: varchar('label', { length: 20 }).notNull().unique(),
  emoji: varchar('emoji', { length: 10 }).notNull(),
  color: varchar('color', { length: 20 }).notNull(),
  description: varchar('description', { length: 100 }),
});

// リレーション定義
export const usersRelations = relations(users, ({ many }) => ({
  moodEntries: many(moodEntries),
}));

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id],
  }),
}));

// 型エクスポート
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type NewMoodEntry = typeof moodEntries.$inferInsert;
export type MoodLabel = typeof moodLabels.$inferSelect;
```

---

## データベース接続設定

### 環境変数 (.env.local)

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/moodtap?sslmode=require"
```

### lib/db/index.ts

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Neon SQL Client
const sql = neon(process.env.DATABASE_URL!);

// Drizzle ORM Instance
export const db = drizzle(sql, { schema });
```

---

## マイグレーション

### drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// .env.local を読み込み
config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### マイグレーションコマンド

```bash
# スキーマからマイグレーションファイル生成
npm run db:generate

# マイグレーション実行
npm run db:push

# Drizzle Studio起動(GUI管理ツール)
npm run db:studio
```

### package.json scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## CRUD操作例

### lib/db/queries.ts

```typescript
import { db } from './index';
import { moodEntries, users } from './schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

// 気分記録の作成
export async function createMoodEntry(data: {
  userId: string;
  date: string; // YYYY-MM-DD
  moodScore: number;
  moodLabel: string;
  note?: string;
}) {
  const result = await db
    .insert(moodEntries)
    .values({
      userId: data.userId,
      date: data.date,
      moodScore: data.moodScore,
      moodLabel: data.moodLabel,
      note: data.note,
    })
    .onConflictDoUpdate({
      target: [moodEntries.userId, moodEntries.date],
      set: {
        moodScore: data.moodScore,
        moodLabel: data.moodLabel,
        note: data.note,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result[0];
}

// ユーザーの気分記録一覧取得(最新30日)
export async function getMoodEntriesByUser(userId: string, limit = 30) {
  return await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, userId))
    .orderBy(desc(moodEntries.date))
    .limit(limit);
}

// 特定日の気分記録取得
export async function getMoodEntryByDate(userId: string, date: string) {
  const result = await db
    .select()
    .from(moodEntries)
    .where(and(eq(moodEntries.userId, userId), eq(moodEntries.date, date)))
    .limit(1);

  return result[0] || null;
}

// 期間指定での気分記録取得
export async function getMoodEntriesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  return await db
    .select()
    .from(moodEntries)
    .where(
      and(
        eq(moodEntries.userId, userId),
        gte(moodEntries.date, startDate),
        lte(moodEntries.date, endDate)
      )
    )
    .orderBy(desc(moodEntries.date));
}

// 気分記録の削除
export async function deleteMoodEntry(id: string) {
  const result = await db
    .delete(moodEntries)
    .where(eq(moodEntries.id, id))
    .returning();

  return result[0] || null;
}
```

---

## API Route実装例

### app/api/mood-entries/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createMoodEntry, getMoodEntriesByUser } from '@/lib/db/queries';
import { getServerSession } from 'next-auth';

// GET /api/mood-entries - 気分記録一覧取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await getMoodEntriesByUser(session.user.id);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch mood entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    );
  }
}

// POST /api/mood-entries - 気分記録の作成
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, moodScore, moodLabel, note } = body;

    // バリデーション
    if (!date || !moodScore || !moodLabel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (moodScore < 1 || moodScore > 5) {
      return NextResponse.json(
        { error: 'Invalid mood score' },
        { status: 400 }
      );
    }

    const entry = await createMoodEntry({
      userId: session.user.id,
      date,
      moodScore,
      moodLabel,
      note,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Failed to create mood entry:', error);
    return NextResponse.json(
      { error: 'Failed to create mood entry' },
      { status: 500 }
    );
  }
}
```

---

## データマイグレーション戦略

### Phase 1 → Phase 2 移行

LocalStorageからPostgreSQLへのデータ移行機能を実装します。

```typescript
// lib/migration.ts

export async function migrateLocalStorageToDatabase(userId: string) {
  const localEntries = getMoodEntries(); // LocalStorageから取得

  for (const entry of localEntries) {
    await createMoodEntry({
      userId,
      date: entry.date,
      moodScore: entry.moodScore,
      moodLabel: entry.moodLabel,
      note: entry.note,
    });
  }

  // 移行完了後、LocalStorageクリア
  localStorage.removeItem(STORAGE_KEY);
}
```

---

## パフォーマンス最適化

### インデックス最適化

```sql
-- 複合インデックス(user_id + date)
CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, date DESC);

-- 部分インデックス(最新30日のみ)
CREATE INDEX idx_mood_entries_recent
  ON mood_entries(user_id, date DESC)
  WHERE date >= CURRENT_DATE - INTERVAL '30 days';
```

### 自動更新タイムスタンプトリガー

```sql
-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mood_entries_updated_at
  BEFORE UPDATE ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## まとめ

MoodTapのデータベース設計は、以下の段階的アプローチを採用します:

1. **Phase 1 (MVP)**: LocalStorage(クライアントサイド)
2. **Phase 2**: Neon PostgreSQL + Drizzle ORM移行
3. **Phase 3以降**: 統計テーブル、エクスポート機能の拡張

シンプルなスキーマ設計により、高速な開発と将来的な拡張性を両立します。

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
