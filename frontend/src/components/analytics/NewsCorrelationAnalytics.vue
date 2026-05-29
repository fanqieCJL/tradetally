<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ s('News Sentiment Analytics') }}</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ s('Analyze your trading patterns in correlation with news sentiment') }}
        </p>
      </div>
      <button
        @click="refreshAnalytics"
        :disabled="loading"
        class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        <MdiIcon :icon="refreshIcon" :size="16" :class="{ 'animate-spin': loading }" class="mr-2" />
        {{ s('Refresh') }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card">
      <div class="card-body text-center py-8">
        <MdiIcon :icon="alertIcon" :size="48" class="mx-auto text-red-500 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ s('Unable to Load Analytics') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button @click="fetchAnalytics" class="btn-primary">
          {{ s('Try Again') }}
        </button>
      </div>
    </div>

    <div v-else-if="!enabled" class="card">
      <div class="card-body text-center py-8">
        <MdiIcon :icon="lockIcon" :size="48" class="mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ s('Pro Feature') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ s('News sentiment correlation analytics is available for Pro users and self-hosters.') }}
        </p>
      </div>
    </div>

    <div v-else-if="analytics" class="space-y-6">
      <div v-if="analytics.insights && analytics.insights.length > 0" class="card">
        <div class="card-body">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <MdiIcon :icon="bulbIcon" :size="20" class="mr-2 text-yellow-500" />
            {{ s('Key Insights') }}
          </h3>
          <div class="space-y-3">
            <div
              v-for="(insight, index) in analytics.insights"
              :key="index"
              class="p-4 rounded-lg border-l-4"
              :class="{
                'bg-green-50 border-green-400 dark:bg-green-900/20': insight.level === 'positive',
                'bg-blue-50 border-blue-400 dark:bg-blue-900/20': insight.level === 'info',
                'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20': insight.level === 'warning'
              }"
            >
              <h4 class="font-medium text-gray-900 dark:text-white">{{ insight.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-body">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ s('Performance by Sentiment') }}</h3>
            <div class="space-y-4">
              <div v-for="(data, sentiment) in analytics.overall_performance.by_sentiment" :key="sentiment" class="border rounded-lg p-4 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div
                      class="w-3 h-3 rounded-full mr-2"
                      :class="{
                        'bg-green-500': sentiment === 'positive',
                        'bg-red-500': sentiment === 'negative',
                        'bg-gray-500': sentiment === 'neutral'
                      }"
                    ></div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ sentimentLabel(sentiment) }}</span>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ tradesCountLabel(data.total_trades) }}</span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">{{ s('Win Rate') }}</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ data.win_rate }}%</div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">{{ s('Avg P&L') }}</div>
                    <div class="font-medium" :class="data.avg_pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ formatCurrency(data.avg_pnl) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">{{ s('Total P&L') }}</div>
                    <div class="font-medium" :class="data.total_pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ formatCurrency(data.total_pnl) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500 dark:text-gray-400">{{ s('Profitable') }}</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ data.profitable_trades }}/{{ data.total_trades }}</div>
                  </div>
                </div>

                <div v-if="data.sides" class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="(sideData, side) in data.sides" :key="side" class="text-sm">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-gray-600 dark:text-gray-400">{{ sideLabel(side) }}</span>
                        <span class="font-medium">{{ sideData.win_rate }}%</span>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ sideBreakdownLabel(sideData.trade_count, sideData.avg_pnl) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ s('Direction Bias') }}</h3>
            <div class="space-y-4">
              <div v-for="(data, sentiment) in analytics.direction_bias" :key="sentiment" class="border rounded-lg p-4 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-medium text-gray-900 dark:text-white">{{ sentimentNewsLabel(sentiment) }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ tradesCountLabel(data.total_trades) }}</span>
                </div>

                <div class="mb-3">
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{{ s('Long') }}</span>
                    <span>{{ s('Short') }}</span>
                  </div>
                  <div class="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      class="absolute left-0 top-0 h-full bg-green-500 transition-all"
                      :style="{ width: data.long_percentage + '%' }"
                    ></div>
                    <div
                      class="absolute right-0 top-0 h-full bg-red-500 transition-all"
                      :style="{ width: data.short_percentage + '%' }"
                    ></div>
                  </div>
                  <div class="flex justify-between text-sm font-medium text-gray-900 dark:text-white mt-1">
                    <span>{{ data.long_percentage }}%</span>
                    <span>{{ data.short_percentage }}%</span>
                  </div>
                </div>

                <div class="text-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ s('Bias Strength:') }} {{ Math.round(data.bias_strength) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="analytics.top_performers && analytics.top_performers.length > 0" class="card">
        <div class="card-body">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ s('Top Performing Combinations') }}</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Symbol') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Sentiment') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Side') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Trades') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Win Rate') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Total P&L') }}</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ s('Avg Return') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="performer in analytics.top_performers.slice(0, 10)"
                  :key="`${performer.symbol}-${performer.sentiment}-${performer.side}`"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  @click="showPerformerDetails(performer)"
                >
                  <td class="px-4 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{{ performer.symbol }}</td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': performer.news_sentiment === 'positive',
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': performer.news_sentiment === 'negative',
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': performer.news_sentiment === 'neutral'
                      }"
                    >
                      {{ sentimentLabel(performer.news_sentiment) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="performer.side === 'long' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
                    >
                      {{ sideLabel(performer.side) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ performer.trade_count }}</td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ performer.win_rate }}%</td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium" :class="performer.total_pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ formatCurrency(performer.total_pnl) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ performer.avg_return_pct }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="analytics.metadata" class="card">
        <div class="card-body">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ s('Analysis Summary') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div class="text-gray-500 dark:text-gray-400">{{ s('Trades Analyzed') }}</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ analytics.metadata.total_trades_analyzed }}</div>
            </div>
            <div v-if="analytics.metadata.date_range.startDate">
              <div class="text-gray-500 dark:text-gray-400">{{ s('Start Date') }}</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ formatDate(analytics.metadata.date_range.startDate) }}</div>
            </div>
            <div v-if="analytics.metadata.date_range.endDate">
              <div class="text-gray-500 dark:text-gray-400">{{ s('End Date') }}</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ formatDate(analytics.metadata.date_range.endDate) }}</div>
            </div>
            <div v-if="analytics.metadata.filters.symbol">
              <div class="text-gray-500 dark:text-gray-400">{{ s('Symbol Filter') }}</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ analytics.metadata.filters.symbol }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body text-center py-8">
        <MdiIcon :icon="chartIcon" :size="48" class="mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ s('No Data Available') }}</h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ s('No completed trades with news data found. Trade some stocks with news to see analytics.') }}
        </p>
      </div>
    </div>

    <div v-if="selectedPerformer" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closePerformerDetails">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ performerModalTitle }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ performerModalSubtitle }}
              </p>
            </div>
            <button @click="closePerformerDetails" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MdiIcon :icon="closeIcon" :size="24" />
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ s('Total Trades') }}</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedPerformer.trade_count }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ s('Win Rate') }}</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedPerformer.win_rate }}%</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ s('Total P&L') }}</div>
              <div class="text-lg font-semibold" :class="selectedPerformer.total_pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ formatCurrency(selectedPerformer.total_pnl) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ s('Avg Return') }}</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedPerformer.avg_return_pct }}%</div>
            </div>
          </div>

          <div v-if="performerDetailsLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>

          <div v-else-if="performerDetailsError" class="text-center py-8">
            <p class="text-red-600 dark:text-red-400">{{ performerDetailsError }}</p>
            <button @click="fetchPerformerDetails" class="mt-2 btn-primary">{{ s('Try Again') }}</button>
          </div>

          <div v-else-if="performerDetails" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ s('Individual Trades') }}</h4>
            <div class="space-y-3">
              <div
                v-for="trade in performerDetails"
                :key="trade.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-4">
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(trade.trade_date) }}</span>
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="trade.pnl >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
                    >
                      {{ formatCurrency(trade.pnl) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ tradeExecutionLabel(trade) }}
                  </div>
                </div>

                <div v-if="trade.news_headlines && trade.news_headlines.length > 0" class="mt-3">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ s('News Headlines:') }}</div>
                  <div class="space-y-2">
                    <div
                      v-for="(headline, index) in trade.news_headlines"
                      :key="index"
                      class="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-2 border-blue-400"
                    >
                      {{ headline }}
                    </div>
                  </div>
                </div>

                <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                  {{ s('No news headlines available for this trade') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTradeDate } from '@/utils/date'
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter'
import { tSentence } from '@/i18n'
import MdiIcon from '@/components/MdiIcon.vue'
import { mdiRefresh, mdiAlertCircle, mdiLock, mdiLightbulb, mdiChartLine, mdiClose } from '@mdi/js'
import api from '@/services/api'

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
const { formatCurrency } = useCurrencyFormatter()

const refreshIcon = mdiRefresh
const alertIcon = mdiAlertCircle
const lockIcon = mdiLock
const bulbIcon = mdiLightbulb
const chartIcon = mdiChartLine
const closeIcon = mdiClose

const analytics = ref(null)
const loading = ref(false)
const error = ref(null)
const enabled = ref(false)

const selectedPerformer = ref(null)
const performerDetails = ref(null)
const performerDetailsLoading = ref(false)
const performerDetailsError = ref(null)

const sentimentLabels = {
  positive: 'Positive',
  negative: 'Negative',
  neutral: 'Neutral'
}

const sideLabels = {
  long: 'Long',
  short: 'Short'
}

function sentimentLabel(sentiment) {
  void locale.value
  return s(sentimentLabels[sentiment] || sentiment)
}

function sideLabel(side) {
  void locale.value
  return s(sideLabels[side] || side)
}

function sentimentNewsLabel(sentiment) {
  void locale.value
  return s('{sentiment} News').replace('{sentiment}', sentimentLabel(sentiment))
}

function tradesCountLabel(count) {
  void locale.value
  return s('{count} trades').replace('{count}', String(count))
}

function sideBreakdownLabel(tradeCount, avgPnl) {
  void locale.value
  return s('{count} trades, {avg} avg')
    .replace('{count}', String(tradeCount))
    .replace('{avg}', formatCurrency(avgPnl))
}

const performerModalTitle = computed(() => {
  void locale.value
  if (!selectedPerformer.value) return ''
  return s('{symbol} - News & Trade Details').replace('{symbol}', selectedPerformer.value.symbol)
})

const performerModalSubtitle = computed(() => {
  void locale.value
  if (!selectedPerformer.value) return ''
  return s('{sentiment} sentiment • {side} positions')
    .replace('{sentiment}', sentimentLabel(selectedPerformer.value.news_sentiment))
    .replace('{side}', sideLabel(selectedPerformer.value.side))
})

function tradeExecutionLabel(trade) {
  void locale.value
  return s('{qty} shares @ {entry} → {exit}')
    .replace('{qty}', String(trade.quantity))
    .replace('{entry}', formatCurrency(trade.entry_price))
    .replace('{exit}', formatCurrency(trade.exit_price))
}

function formatDate(date) {
  return formatTradeDate(date, 'MMM dd, yyyy')
}

async function fetchAnalytics() {
  loading.value = true
  error.value = null

  try {
    const enabledResponse = await api.get('/news-correlation/enabled')
    enabled.value = enabledResponse.data.enabled

    if (!enabled.value) {
      return
    }

    const response = await api.get('/news-correlation/analytics')
    analytics.value = response.data
  } catch (err) {
    console.error('Failed to fetch news correlation analytics:', err)
    if (err.response?.status === 403) {
      error.value = s('This feature requires Pro tier access')
      enabled.value = false
    } else {
      error.value = s(err.response?.data?.error || 'Failed to load analytics')
    }
  } finally {
    loading.value = false
  }
}

function refreshAnalytics() {
  fetchAnalytics()
}

async function showPerformerDetails(performer) {
  selectedPerformer.value = performer
  performerDetails.value = null
  performerDetailsError.value = null
  await fetchPerformerDetails()
}

async function fetchPerformerDetails() {
  if (!selectedPerformer.value) return

  performerDetailsLoading.value = true
  performerDetailsError.value = null

  try {
    const response = await api.get('/news-correlation/performer-details', {
      params: {
        symbol: selectedPerformer.value.symbol,
        sentiment: selectedPerformer.value.news_sentiment,
        side: selectedPerformer.value.side
      }
    })
    performerDetails.value = response.data
  } catch (err) {
    console.error('Failed to fetch performer details:', err)
    performerDetailsError.value = s(err.response?.data?.error || 'Failed to load trade details')
  } finally {
    performerDetailsLoading.value = false
  }
}

function closePerformerDetails() {
  selectedPerformer.value = null
  performerDetails.value = null
  performerDetailsError.value = null
}

onMounted(() => {
  fetchAnalytics()
})
</script>
