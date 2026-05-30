<template>
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ s('Key Metrics') }}</h2>
      <span v-if="metrics?.latest_year" class="text-xs text-gray-500 dark:text-gray-400">
        {{ s('Latest fiscal year:') }} {{ metrics.latest_year }}
      </span>
    </div>

    <div v-if="!metrics" class="p-6 text-sm text-gray-500 dark:text-gray-400">
      {{ s('Loading key metrics...') }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8">
      <dl
        v-for="(group, groupIndex) in groups"
        :key="groupIndex"
        class="divide-y divide-gray-100 dark:divide-gray-700"
      >
        <div
          v-for="item in group"
          :key="item.label"
          class="flex items-center justify-between px-6 py-3"
        >
          <dt class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</dt>
          <dd class="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
            {{ item.value }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { formatAppDate } from '@/utils/date'

const props = defineProps({
  metrics: {
    type: Object,
    default: null
  }
})

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

function formatLargeNumber(value, withCurrency = true) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return s('N/A')
  const num = Number(value)
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''
  const prefix = withCurrency ? '$' : ''
  if (abs >= 1e12) return `${sign}${prefix}${(abs / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `${sign}${prefix}${(abs / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${sign}${prefix}${(abs / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `${sign}${prefix}${(abs / 1e3).toFixed(2)}K`
  return `${sign}${prefix}${abs.toFixed(2)}`
}

function formatLargeCurrency(value) {
  return formatLargeNumber(value, true)
}

function formatPrice(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return s('N/A')
  return `$${Number(value).toFixed(2)}`
}

function formatPercent(decimal, digits = 2) {
  if (decimal === null || decimal === undefined || !Number.isFinite(Number(decimal))) return s('N/A')
  return `${(Number(decimal) * 100).toFixed(digits)}%`
}

function formatRatio(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return s('N/A')
  return Number(value).toFixed(2)
}

function formatDate(value) {
  if (!value) return null
  return formatAppDate(value) || null
}

const groups = computed(() => {
  void locale.value
  const m = props.metrics || {}

  const column1 = [
    { label: s('Market Cap'), value: formatLargeCurrency(m.market_cap) },
    { label: s('Revenue (TTM)'), value: formatLargeCurrency(m.current_revenue) },
    { label: s('Net Income (TTM)'), value: formatLargeCurrency(m.current_net_income) },
    { label: s('5Yr Avg Net Income'), value: formatLargeCurrency(m.avg_net_income_5yr) },
    { label: s('P/E (TTM)'), value: formatRatio(m.pe_ratio) },
    { label: s('5Yr P/E'), value: formatRatio(m.pe_5yr) },
    { label: s('PS Ratio'), value: formatRatio(m.ps_ratio) },
    { label: s('PEG Ratio'), value: formatRatio(m.peg_ratio) },
    { label: s('Profit Margin (TTM)'), value: formatPercent(m.profit_margin_1yr) },
    { label: s('5Yr Profit Margin'), value: formatPercent(m.profit_margin_5yr) },
    { label: s('10Yr Profit Margin'), value: formatPercent(m.profit_margin_10yr) },
    { label: s('Gross Profit Margin (TTM)'), value: formatPercent(m.gross_profit_margin_1yr) },
    { label: s('3Yr Compound Revenue Growth'), value: formatPercent(m.revenue_growth_3yr) },
    { label: s('5Yr Compound Revenue Growth'), value: formatPercent(m.revenue_growth_5yr) },
    { label: s('10Yr Compound Revenue Growth'), value: formatPercent(m.revenue_growth_10yr) }
  ]

  const column2 = [
    { label: s('Free Cash Flow (TTM)'), value: formatLargeCurrency(m.current_fcf) },
    { label: s('5Yr Avg FCF'), value: formatLargeCurrency(m.avg_fcf_5yr) },
    { label: s('Price/FCF (TTM)'), value: formatRatio(m.price_to_fcf) },
    { label: s('5Yr Price/FCF'), value: formatRatio(m.pfcf_5yr) },
    { label: s('FCF Margin (TTM)'), value: formatPercent(m.fcf_margin_1yr) },
    { label: s('5Yr FCF Margin'), value: formatPercent(m.fcf_margin_5yr) },
    { label: s('Dividend Yield (TTM)'), value: formatPercent(m.dividend_yield) },
    { label: s('Dividends Paid (TTM)'), value: formatLargeCurrency(m.dividends_paid_ttm) },
    { label: s('Forward Dividend Yield'), value: formatPercent(m.forward_dividend_yield) },
    { label: s('Enterprise Value'), value: formatLargeCurrency(m.enterprise_value) },
    { label: s('Total Debt'), value: formatLargeCurrency(m.total_debt) },
    { label: s('Cash & Equivalents'), value: formatLargeCurrency(m.cash_and_equivalents) }
  ]

  const week52HighLabel = m.week_52_high_date
    ? s('52 WK High ({date})').replace('{date}', formatDate(m.week_52_high_date))
    : s('52 WK High')
  const week52LowLabel = m.week_52_low_date
    ? s('52 WK Low ({date})').replace('{date}', formatDate(m.week_52_low_date))
    : s('52 WK Low')

  const column3 = [
    { label: s('Return on Invested Capital (TTM)'), value: formatPercent(m.roic_1yr) },
    { label: s('5Yr Return on Invested Capital'), value: formatPercent(m.roic_5yr) },
    { label: s('10Yr Return on Invested Capital'), value: formatPercent(m.roic_10yr) },
    { label: s('Current Price'), value: formatPrice(m.current_price) },
    { label: week52HighLabel, value: formatPrice(m.week_52_high) },
    { label: week52LowLabel, value: formatPrice(m.week_52_low) },
    { label: s('Beta'), value: formatRatio(m.beta) },
    { label: s('Shares Outstanding'), value: formatLargeNumber(m.shares_outstanding, false) }
  ]

  return [column1, column2, column3]
})
</script>
