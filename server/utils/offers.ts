import type { Offer, OffersResponse } from '#shared/types/paywall'

const MONTHLY_PRICE = 299
const ANNUAL_PRICE = 1490

/**
 * Offer catalog. Kept in code on purpose: the task needs a server-driven list, not an admin panel.
 * Moving it to a table later only changes this module — the API contract stays the same.
 */
const OFFERS: Offer[] = [
  {
    id: 'annual',
    title: 'Год',
    caption: `${formatPrice(ANNUAL_PRICE)} в год`,
    price: ANNUAL_PRICE,
    currency: 'RUB',
    periodMonths: 12,
    badge: `Выгода ${savingsPercent(ANNUAL_PRICE, 12, MONTHLY_PRICE)}%`,
  },
  {
    id: 'monthly',
    title: 'Месяц',
    caption: 'Оплата каждый месяц',
    price: MONTHLY_PRICE,
    currency: 'RUB',
    periodMonths: 1,
    badge: null,
  },
]

export function getOffers(): OffersResponse {
  return { offers: OFFERS, defaultOfferId: 'annual' }
}

export function findOffer(id: string): Offer | undefined {
  return OFFERS.find(offer => offer.id === id)
}
