import type { RestoreResponse } from '#shared/types/paywall'

export default defineEventHandler(async (event): Promise<RestoreResponse> => {
  const { deviceId } = await readValidatedBody(event, restoreBodySchema.parse)
  return { purchase: await findLatestPurchase(deviceId) }
})
