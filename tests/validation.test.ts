import { describe, expect, it } from 'vitest'
import { purchaseBodySchema, restoreBodySchema } from '../server/utils/validation'

const valid = {
  offerId: 'annual',
  deviceId: '3f1c2b9e-8d4a-4f6b-9a1e-2c3d4e5f6a7b',
  idempotencyKey: '7b0c4c2e-1a4b-4c55-9d7e-0f3b2a1c9e11',
}

describe('purchase body', () => {
  it('accepts a well-formed request', () => {
    expect(purchaseBodySchema.parse(valid)).toEqual(valid)
  })

  it('accepts an opaque device id coming from the host app', () => {
    expect(purchaseBodySchema.safeParse({ ...valid, deviceId: 'ios:A1B2C3D4.app' }).success).toBe(true)
  })

  it.each([
    ['missing offer', { ...valid, offerId: '' }],
    ['short device id', { ...valid, deviceId: 'abc' }],
    ['device id with spaces/markup', { ...valid, deviceId: '<script>alert(1)</script>' }],
    ['non-uuid idempotency key', { ...valid, idempotencyKey: '123' }],
  ])('rejects %s', (_, body) => {
    expect(purchaseBodySchema.safeParse(body).success).toBe(false)
  })
})

describe('restore body', () => {
  it('requires a device id', () => {
    expect(restoreBodySchema.safeParse({}).success).toBe(false)
    expect(restoreBodySchema.safeParse({ deviceId: valid.deviceId }).success).toBe(true)
  })
})
