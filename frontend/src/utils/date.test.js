import { describe, expect, it, vi } from 'vitest'
import { formatLocalDate, formatTradeDate, parseTradeDate, formatAppDate, formatDateParts, getAppDateInputPlaceholder } from './date'

vi.mock('@/i18n', () => ({
  i18n: {
    global: {
      locale: { value: 'en' }
    }
  }
}))

describe('date utilities', () => {
  it('formats dates as local YYYY-MM-DD values', () => {
    expect(formatLocalDate(new Date(2026, 3, 9, 23, 30))).toBe('2026-04-09')
    expect(formatLocalDate('invalid')).toBe('')
    expect(formatLocalDate(null)).toBe('')
  })

  it('parses date-only and midnight UTC trade dates as local calendar dates', () => {
    const dateOnly = parseTradeDate('2026-04-09')
    const midnightUtc = parseTradeDate('2026-04-09T00:00:00.000Z')

    expect(formatLocalDate(dateOnly)).toBe('2026-04-09')
    expect(formatLocalDate(midnightUtc)).toBe('2026-04-09')
  })

  it('formats trade dates and reports invalid values', () => {
    expect(formatTradeDate('2026-04-09', 'yyyy-MM-dd')).toBe('2026-04-09')
    expect(formatTradeDate('not-a-date')).toBe('Invalid Date')
    expect(formatTradeDate(null)).toBe('')
  })

  it('formats app dates in English as yyyy-MM-dd', async () => {
    const { i18n } = await import('@/i18n')
    i18n.global.locale.value = 'en'
    expect(formatAppDate('2026-05-28')).toBe('2026-05-28')
    expect(formatAppDate('2026-05-28T00:00:00.000Z')).toBe('2026-05-28')
  })

  it('formats app dates in Chinese as yyyy年MM月dd日', async () => {
    const { i18n } = await import('@/i18n')
    i18n.global.locale.value = 'zh'
    expect(formatAppDate('2026-05-28')).toBe('2026年05月28日')
  })

  it('formats date parts by locale', () => {
    const parts = { year: '2026', month: '05', day: '28' }
    expect(formatDateParts(parts, 'en-US')).toBe('2026-05-28')
    expect(formatDateParts(parts, 'zh-CN')).toBe('2026年05月28日')
  })

  it('returns locale-specific date input placeholders', async () => {
    const { i18n } = await import('@/i18n')
    i18n.global.locale.value = 'en'
    expect(getAppDateInputPlaceholder()).toBe('yyyy-mm-dd')
    i18n.global.locale.value = 'zh'
    expect(getAppDateInputPlaceholder()).toBe('年-月-日')
  })
})
