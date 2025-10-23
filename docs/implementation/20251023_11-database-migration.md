# Phase 11: データベース移行準備

**作成日**: 2025年10月23日
**Phase**: 11/12
**所要時間**: 45-60分
**前提条件**: Phase 1-10完了

---

## Phase概要

### 目的
Neon PostgreSQL + Drizzle ORMの設定を行い、将来のマルチユーザー対応への準備を整える。

### 成果物
- Neonデータベースセットアップ
- Drizzle ORMスキーマ定義
- マイグレーションファイル
- 環境変数設定

---

## 実装タスク詳細

### タスク1: Neonアカウント作成 (10分)

1. https://neon.tech にアクセス
2. GitHubでサインアップ
3. 新規プロジェクト作成 (moodtap)
4. 接続文字列をコピー

### タスク2: Drizzle ORMセットアップ (15分)

#### パッケージインストール

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

#### ファイル: `.env.local`

```env
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/moodtap?sslmode=require"
```

#### ファイル: `drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### タスク3: スキーマ定義 (20分)

#### ファイル: `lib/db/schema.ts`

```typescript
import { pgTable, uuid, varchar, date, smallint, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * ユーザーテーブル (Phase 2で実装)
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 気分記録テーブル
 */
export const moodEntries = pgTable('mood_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  moodScore: smallint('mood_score').notNull(),
  moodLabel: varchar('mood_label', { length: 20 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type NewMoodEntry = typeof moodEntries.$inferInsert;
```

#### ファイル: `lib/db/client.ts`

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

### タスク4: マイグレーション (10分)

#### package.jsonにスクリプト追加

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

#### マイグレーション実行

```bash
# スキーマ生成
npm run db:generate

# データベースにプッシュ
npm run db:push

# Drizzle Studioで確認
npm run db:studio
```

### タスク5: API Routes (Phase 2で本格実装)

#### ファイル: `app/api/mood/route.ts` (サンプル)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { moodEntries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET: 気分記録取得
export async function GET(request: NextRequest) {
  try {
    const userId = 'temp-user-id'; // Phase 2で認証実装後に置き換え

    const entries = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(moodEntries.date);

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch mood entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: 気分記録作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'temp-user-id'; // Phase 2で認証実装後に置き換え

    const newEntry = await db.insert(moodEntries).values({
      userId,
      date: body.date,
      moodScore: body.moodScore,
      moodLabel: body.moodLabel,
      note: body.note,
    }).returning();

    return NextResponse.json(newEntry[0]);
  } catch (error) {
    console.error('Failed to create mood entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## チェックリスト

- [ ] Neonデータベースが作成されている
- [ ] Drizzle ORMがインストールされている
- [ ] スキーマが定義されている
- [ ] マイグレーションが成功する
- [ ] Drizzle Studioでテーブルが確認できる
- [ ] .env.localがgitignoreされている

---

## 注意事項

### セキュリティ
- `.env.local`は絶対にGitにコミットしない
- DATABASE_URLは環境変数で管理

### Phase 2への移行
現時点ではLocalStorageを継続使用。Phase 2 (将来実装)で:
1. NextAuth.js導入
2. API Routes実装
3. データ移行ツール作成

---

## 次のPhaseへの接続

Phase 12で最終調整とデプロイを実施します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
