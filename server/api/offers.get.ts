import type { OffersResponse } from '#shared/types/paywall'

export default defineEventHandler(async (event): Promise<OffersResponse> => {
  await applySimulation(getQuery(event).simulate, 'Offers are temporarily unavailable')
  setHeader(event, 'Cache-Control', 'no-store')
  return getOffers()
})
