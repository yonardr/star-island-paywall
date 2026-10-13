import type { Purchase } from '#shared/types/paywall'

interface PurchaseRow {
  id: string
  offer_id: string
  price: number
  currency: Purchase['currency']
  created_at: Date | string
}

const COLUMNS = 'id, offer_id, price, currency, created_at'

function toPurchase(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    offerId: row.offer_id,
    price: row.price,
    currency: row.currency,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

export async function createPurchase(input: {
  offerId: string
  deviceId: string
  price: number
  currency: Purchase['currency']
  idempotencyKey: string
}): Promise<Purchase> {
  const db = await useDb()
  const params = [input.offerId, input.deviceId, input.price, input.currency, input.idempotencyKey]
  // A retried request with the same key returns the original row instead of inserting a duplicate
  const [inserted] = await db.query<PurchaseRow>(
    `INSERT INTO purchases (offer_id, device_id, price, currency, idempotency_key)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING ${COLUMNS}`,
    params,
  )
  if (inserted) return toPurchase(inserted)

  const [existing] = await db.query<PurchaseRow & { device_id: string }>(
    `SELECT ${COLUMNS}, device_id FROM purchases WHERE idempotency_key = $1`,
    [input.idempotencyKey],
  )
  if (!existing || existing.device_id !== input.deviceId || existing.offer_id !== input.offerId) {
    throw createError({ statusCode: 409, statusMessage: 'Idempotency key reused with different parameters' })
  }
  return toPurchase(existing)
}

export async function findLatestPurchase(deviceId: string): Promise<Purchase | null> {
  const db = await useDb()
  const [row] = await db.query<PurchaseRow>(
    `SELECT ${COLUMNS} FROM purchases WHERE device_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [deviceId],
  )
  return row ? toPurchase(row) : null
}
