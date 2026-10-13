import type { PurchaseResponse } from '#shared/types/paywall'

export default defineEventHandler(async (event): Promise<PurchaseResponse> => {
  const body = await readValidatedBody(event, purchaseBodySchema.parse)
  const offer = findOffer(body.offerId)
  if (!offer) throw createError({ statusCode: 404, statusMessage: `Unknown offer "${body.offerId}"` })

  // Stand-in for a payment provider round-trip: no SDK, no money — just a test operation
  await new Promise(resolve => setTimeout(resolve, 700))
  await applySimulation(getQuery(event).simulate, 'Payment provider is unavailable')

  const purchase = await createPurchase({
    offerId: offer.id,
    deviceId: body.deviceId,
    price: offer.price,
    currency: offer.currency,
    idempotencyKey: body.idempotencyKey,
  })
  setResponseStatus(event, 201)
  return { purchase }
})
