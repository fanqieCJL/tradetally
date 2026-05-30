import { format as formatDateFns } from 'date-fns'
import { i18n } from '@/i18n'

/**
 * Whether the active UI locale is Chinese.
 */
export function isChineseLocale() {
  return i18n.global.locale.value === 'zh'
}

/**
 * BCP-47 locale tag for date/number formatting.
 */
export function getAppDateLocaleTag() {
  return isChineseLocale() ? 'zh-CN' : 'en-US'
}

/**
 * Placeholder hint for date inputs.
 * zh → 年-月-日, en → yyyy-mm-dd
 */
export function getAppDateInputPlaceholder() {
  return isChineseLocale() ? '年-月-日' : 'yyyy-mm-dd'
}

/**
 * zh → yyyy年MM月dd日, en → yyyy-MM-dd
 */
export function formatAppDate(date) {
  const d = parseTradeDate(date)
  if (!d) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  if (isChineseLocale()) {
    return `${year}年${month}月${day}日`
  }
  return `${year}-${month}-${day}`
}

/**
 * Extract YYYY-MM-DD date parts for a Date in a specific timezone.
 */
export function getDatePartsInTimezone(date, timezone = 'UTC') {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const parts = formatter.formatToParts(date)
  const values = {}
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value
    }
  }

  return {
    year: values.year,
    month: values.month,
    day: values.day
  }
}

/**
 * Format date parts according to UI locale.
 */
export function formatDateParts(parts, uiLocale = getAppDateLocaleTag()) {
  if (!parts?.year || !parts?.month || !parts?.day) return ''
  if (uiLocale === 'zh-CN') {
    return `${parts.year}年${parts.month}月${parts.day}日`
  }
  return `${parts.year}-${parts.month}-${parts.day}`
}

/**
 * Format a Date object as YYYY-MM-DD in local timezone.
 * This avoids the timezone shift issue when using toISOString().split('T')[0]
 * which converts to UTC and can show tomorrow's date after 6PM CST.
 */
export function formatLocalDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get today's date as YYYY-MM-DD in local timezone.
 */
export function getLocalToday() {
  return formatLocalDate(new Date())
}

/**
 * Parse a trade-related date or datetime string into a Date object,
 * handling date-only and "midnight UTC" values without causing
 * off-by-one issues in the user's local timezone.
 */
export function parseTradeDate(date) {
  if (!date) return null

  const dateStr = date.toString()

  // Match date-only (YYYY-MM-DD) or midnight timestamps
  // like YYYY-MM-DDT00:00:00(.sss)?(Z|±HH:MM)
  const dateOnlyMatch = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T00:00:00(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/
  )

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch.map(Number)
    // Construct in local timezone to avoid UTC shifting
    return new Date(year, month - 1, day)
  }

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d
}

/**
 * Format a trade-related date using a safe parser that avoids
 * off-by-one issues for date-only values.
 */
export function formatTradeDate(date, pattern = 'MMM dd, yyyy') {
  if (!date) return ''
  const d = parseTradeDate(date)
  if (!d) return 'Invalid Date'
  return formatDateFns(d, pattern)
}


