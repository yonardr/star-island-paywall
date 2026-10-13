import { neon } from '@neondatabase/serverless'

export interface Db {
  query: <T = Record<string, unknown>>(text: string, params?: unknown[]) => Promise<T[]>
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS purchases (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id        text        NOT NULL,
    device_id       text        NOT NULL,
    price           integer     NOT NULL,
    currency        text        NOT NULL,
    idempotency_key text        NOT NULL UNIQUE,
    created_at      timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS purchases_device_created_idx ON purchases (device_id, created_at DESC)`,
]

let dbPromise: Promise<Db> | undefined

/**
 * Postgres everywhere:
 *  - DATABASE_URL set (Vercel + Neon, or locally after `vercel env pull`) → Neon serverless driver over HTTP;
 *  - dev without DATABASE_URL → embedded PGlite in .data/pglite, so `npm run dev` works with zero setup.
 * Same SQL in both cases. The schema is idempotent and applied once per server instance —
 * for a single table this is simpler than a migration tool.
 */
export function useDb(): Promise<Db> {
  dbPromise ??= connect().catch((error) => {
    dbPromise = undefined // let the next request retry instead of caching the failure
    throw error
  })
  return dbPromise
}

async function connect(): Promise<Db> {
  const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL || process.env.POSTGRES_URL
  let db: Db

  if (url) {
    const sql = neon(url)
    db = { query: async (text, params = []) => (await sql.query(text, params)) as never }
  }
  else if (import.meta.dev) {
    const [{ PGlite }, { mkdir }] = await Promise.all([import('@electric-sql/pglite'), import('node:fs/promises')])
    await mkdir('.data', { recursive: true })
    const pg = new PGlite('.data/pglite')
    db = { query: async (text, params = []) => (await pg.query(text, params)).rows as never }
  }
  else {
    throw new Error('DATABASE_URL is not configured')
  }

  for (const statement of SCHEMA) await db.query(statement)
  return db
}
