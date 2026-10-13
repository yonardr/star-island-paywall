import { describe, expect, it } from 'vitest'
import { formatPrice, pricePerMonth, savingsPercent } from '../shared/utils/price'

describe('price utils', () => {
  it('formats rubles with a plain-space thousands separator', () => {
    expect(formatPrice(1490)).toBe('1 490 ₽')
    expect(formatPrice(299)).toBe('299 ₽')
  })

  it('computes the per-month price of a long plan', () => {
    expect(pricePerMonth(1490, 12)).toBe(124)
    expect(pricePerMonth(299, 1)).toBe(299)
  })

  it('computes the annual saving vs paying monthly', () => {
    expect(savingsPercent(1490, 12, 299)).toBe(58)
  })
})
