export type Currency = 'RUB'

export interface Offer {
  id: string
  /** "Год" / "Месяц" */
  title: string
  /** Secondary line under the title */
  caption: string
  /** Full price for the period, in whole currency units */
  price: number
  currency: Currency
  periodMonths: number
  /** Promo label rendered on top of the card, e.g. "Выгода 58%" */
  badge: string | null
}

export interface OffersResponse {
  offers: Offer[]
  defaultOfferId: string
}

export interface Purchase {
  id: string
  offerId: string
  price: number
  currency: Currency
  createdAt: string
}

export interface PurchaseRequest {
  offerId: string
  deviceId: string
  /** Client-generated per purchase attempt — repeated taps/retries never create a second row */
  idempotencyKey: string
}

export interface PurchaseResponse {
  purchase: Purchase
}

export interface RestoreResponse {
  purchase: Purchase | null
}
