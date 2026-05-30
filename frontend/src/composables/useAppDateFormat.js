import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatAppDate, getAppDateLocaleTag } from '@/utils/date'
import { formatDateTimeInTimezone } from '@/utils/timezone'
import { useUserTimezone } from '@/composables/useUserTimezone'

/**
 * Locale-aware date formatting for UI display.
 * zh → yyyy年MM月dd日, en → yyyy-MM-dd
 */
export function useAppDateFormat() {
  const { locale } = useI18n()
  const { userTimezone, use12Hour } = useUserTimezone()

  const uiLocale = computed(() => getAppDateLocaleTag())

  function formatDate(value) {
    void locale.value
    return formatAppDate(value)
  }

  function formatDateTime(value, options = {}) {
    void locale.value
    return formatDateTimeInTimezone(value, userTimezone.value, {
      hour12: use12Hour.value,
      uiLocale: uiLocale.value,
      ...options
    })
  }

  return {
    uiLocale,
    formatDate,
    formatDateTime
  }
}
