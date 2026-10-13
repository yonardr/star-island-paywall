const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

/** 1490 → "1 490 ₽" (regular spaces so the string matches the mockup glyph-for-glyph) */
export function formatPrice(amount: number): string {
  return `${formatter.format(amount).replace(/\s/g, ' ')} ₽`
}

export function pricePerMonth(price: number, periodMonths: number): number {
  return Math.round(price / periodMonths)
}

/** Discount of a long plan relative to paying monthly for the same period, in whole percent (floored). */
export function savingsPercent(price: number, periodMonths: number, monthlyPrice: number): number {
  return Math.floor((1 - price / (monthlyPrice * periodMonths)) * 100)
}
