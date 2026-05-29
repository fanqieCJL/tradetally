<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        <div>
          <!-- Success/Warning Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="iconBgClass">
            <CheckCircleIcon v-if="importStatus === 'success'" class="h-6 w-6" :class="iconClass" />
            <ExclamationTriangleIcon v-else-if="importStatus === 'warning'" class="h-6 w-6" :class="iconClass" />
            <XCircleIcon v-else class="h-6 w-6" :class="iconClass" />
          </div>

          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
              {{ title }}
            </h3>
          </div>

          <!-- Summary Stats -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ tradesImported }}</p>
              <p class="text-xs text-green-700 dark:text-green-300">{{ s('Imported') }}</p>
            </div>
            <div v-if="duplicatesSkipped > 0" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ duplicatesSkipped }}</p>
              <p class="text-xs text-blue-700 dark:text-blue-300">{{ s('Duplicates') }}</p>
            </div>
            <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-gray-400">0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ s('Duplicates') }}</p>
            </div>
            <div v-if="rowsSkipped > 0" class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ rowsSkipped }}</p>
              <p class="text-xs text-yellow-700 dark:text-yellow-300">{{ s('Skipped') }}</p>
            </div>
            <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p class="text-2xl font-bold text-gray-400">0</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ s('Skipped') }}</p>
            </div>
          </div>

          <!-- Diagnostics Details -->
          <div v-if="diagnostics" class="mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ s('Processed {rows} rows from CSV').replace('{rows}', (diagnostics.totalRows?.toLocaleString() || '0')) }}
              <span v-if="diagnostics.detectedBroker">
                {{ s('(detected as {broker})').replace('{broker}', formatBrokerName(diagnostics.detectedBroker)) }}
              </span>
            </p>
          </div>

          <div v-if="reasonBreakdown.length > 0" class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ s('Top row issues') }}</p>
            <ul class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li v-for="item in displayedReasonBreakdown" :key="item.reason" class="flex items-start justify-between gap-3">
                <span class="min-w-0">{{ s(item.reason) }}</span>
                <span class="shrink-0 text-xs text-gray-500 dark:text-gray-500">{{ item.count === 1 ? s('{count} row').replace('{count}', String(item.count)) : s('{count} rows').replace('{count}', String(item.count)) }}</span>
              </li>
            </ul>
          </div>

          <div v-if="props.tradesImported === 0" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
            <p class="text-sm font-semibold text-amber-900 dark:text-amber-100">{{ zeroTradeReason.title }}</p>
            <p class="mt-1 text-sm text-amber-800 dark:text-amber-200">{{ zeroTradeReason.body }}</p>
            <ul class="mt-3 space-y-1 text-sm text-amber-800 dark:text-amber-200">
              <li v-for="step in zeroTradeReason.steps" :key="step" class="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{{ step }}</span>
              </li>
            </ul>
          </div>

          <div v-if="props.achievements.length > 0" class="mt-4">
            <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <div class="flex items-start gap-3">
                <TrophyIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-amber-900 dark:text-amber-100">
                    {{ props.achievements.length === 1 ? s('Achievement unlocked') : s('{count} achievements unlocked').replace('{count}', String(props.achievements.length)) }}
                  </p>
                  <p class="mt-1 text-sm text-amber-800 dark:text-amber-200">
                    {{ achievementSummary }}
                  </p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      v-for="achievement in props.achievements.slice(0, 4)"
                      :key="achievement.id || achievement.name"
                      class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800"
                    >
                      {{ achievement.name }}
                    </span>
                    <span
                      v-if="props.achievements.length > 4"
                      class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800"
                    >
                      +{{ props.achievements.length - 4 }} {{ s('more') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Warnings Section -->
          <div v-if="warnings && warnings.length > 0" class="mt-4">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div class="flex items-start">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">{{ s('Warnings') }}</p>
                  <ul class="mt-1 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                    <li v-for="(warning, index) in warnings" :key="index">{{ s(warning) }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Skipped Rows Details (expandable) -->
          <div v-if="skippedReasons && skippedReasons.length > 0" class="mt-4">
            <button
              @click="showSkippedDetails = !showSkippedDetails"
              class="flex items-center justify-between w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
            >
              <span class="flex items-center">
                <InformationCircleIcon class="h-5 w-5 mr-2" />
                View skipped row details ({{ skippedReasons.length }})
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': showSkippedDetails }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="showSkippedDetails" class="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Row</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(item, index) in displayedSkippedReasons" :key="index">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.row }}</td>
                    <td class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{{ item.reason }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="skippedReasons.length > maxDisplayedReasons" class="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                Showing first {{ maxDisplayedReasons }} of {{ skippedReasons.length }} skipped rows
              </div>
            </div>
          </div>

          <!-- Failed Trades Details -->
          <div v-if="failedTrades && failedTrades.length > 0" class="mt-4">
            <button
              @click="showFailedDetails = !showFailedDetails"
              class="flex items-center justify-between w-full text-left text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg p-3"
            >
              <span class="flex items-center">
                <XCircleIcon class="h-5 w-5 mr-2" />
                View failed trades ({{ failedTrades.length }})
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': showFailedDetails }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="showFailedDetails" class="mt-2 max-h-48 overflow-y-auto border border-red-200 dark:border-red-800 rounded-lg">
              <div v-for="(item, index) in failedTrades.slice(0, maxDisplayedReasons)" :key="index" class="px-3 py-2 border-b border-red-100 dark:border-red-900 last:border-b-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.trade?.symbol || 'Unknown' }}</p>
                <p class="text-xs text-red-600 dark:text-red-400">{{ item.error }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showDemoDataCta && tradesImported === 0" class="mt-4">
          <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <div class="flex items-start">
              <InformationCircleIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {{ s('Explore with demo data instead') }}
                </p>
                <p class="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  {{ s('If this CSV is blocking you, load sample trades and explore the dashboard and analytics flow right now.') }}
                </p>
                <button
                  type="button"
                  class="mt-3 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 disabled:opacity-60"
                  :disabled="demoDataLoading"
                  @click="$emit('load-demo-data')"
                >
                  {{ demoDataLoading ? s('Loading Demo Data...') : s('Load Demo Data') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Need Help? Section (for supported brokers with 0 trades) -->
        <div v-if="showNeedHelp" class="mt-4">
          <div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div class="flex items-start">
              <InformationCircleIcon class="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-medium text-primary-800 dark:text-primary-200">
                  {{ s('Need Help?') }}
                </p>
                <p class="mt-1 text-sm text-primary-700 dark:text-primary-300">
                  {{ s('Having trouble importing from {broker}?').replace('{broker}', formatBrokerName(effectiveBroker)) }}
                </p>
                <div class="mt-3 flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://docs.tradetally.io/usage/importing-trades/#supported-brokers"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    {{ s('View Import Documentation') }}
                    <svg class="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    :href="supportMailtoLink"
                    class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                    @click="$emit('support-clicked', { source: 'results_modal', detectedBroker: effectiveBroker, headerCount: diagnostics?.headerAnalysis?.foundHeaders?.length || 0 })"
                  >
                    {{ s('Open a Support Ticket') }}
                    <svg class="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 sm:mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:w-auto sm:text-sm"
            @click="$emit('close')"
          >
            {{ s('Close') }}
          </button>
          <button
            v-if="props.tradesImported > 0"
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-primary-300 px-4 py-2 text-base font-medium text-primary-700 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30 sm:w-auto sm:text-sm"
            @click="$emit('view-trades')"
          >
            {{ s('View Trades') }}
          </button>
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
            @click="$emit('view-analytics')"
          >
            {{ s('View Analytics') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, TrophyIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  tradesImported: {
    type: Number,
    default: 0
  },
  duplicatesSkipped: {
    type: Number,
    default: 0
  },
  diagnostics: {
    type: Object,
    default: null
  },
  failedTrades: {
    type: Array,
    default: () => []
  },
  achievements: {
    type: Array,
    default: () => []
  },
  selectedBroker: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  showDemoDataCta: {
    type: Boolean,
    default: false
  },
  demoDataLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'load-demo-data', 'view-analytics', 'view-trades', 'support-clicked'])

function handleEscape(e) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) window.addEventListener('keydown', handleEscape)
    else window.removeEventListener('keydown', handleEscape)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

const showSkippedDetails = ref(false)
const showFailedDetails = ref(false)
const maxDisplayedReasons = 50

const brokerNames = {
  auto: 'Auto-Detect',
  generic: 'Generic CSV',
  lightspeed: 'Lightspeed Trader',
  schwab: 'Charles Schwab',
  thinkorswim: 'ThinkorSwim',
  ibkr: 'Interactive Brokers',
  ibkr_trade_confirmation: 'IBKR Trade Confirmation',
  captrader: 'CapTrader',
  webull: 'Webull',
  etrade: 'E*TRADE',
  papermoney: 'PaperMoney',
  tradervue: 'TraderVue',
  avatrade: 'AvaTrade',
  tradingview: 'TradingView',
  tradingview_performance: 'TradingView',
  tradingview_paper: 'TradingView',
  tradovate: 'Tradovate',
  questrade: 'Questrade',
  projectx: 'ProjectX',
  tradestation: 'TradeStation',
  tastytrade: 'Tastytrade'
}

const supportedBrokers = [
  'lightspeed', 'schwab', 'thinkorswim', 'ibkr', 'ibkr_trade_confirmation', 'captrader',
  'webull', 'etrade', 'papermoney', 'tradervue', 'avatrade', 'tradingview', 'tradovate', 'questrade',
  'projectx', 'tradestation', 'tastytrade'
]

function formatBrokerName(broker) {
  return brokerNames[broker] ? s(brokerNames[broker]) : broker
}

const rowsSkipped = computed(() => {
  if (!props.diagnostics) return 0
  return (props.diagnostics.skippedRows || 0) + (props.diagnostics.invalidRows || 0)
})

const skippedReasons = computed(() => {
  return props.diagnostics?.skippedReasons || []
})

const warnings = computed(() => {
  return props.diagnostics?.warnings || []
})

const achievementSummary = computed(() => {
  if (props.achievements.length === 0) return ''
  if (props.achievements.length === 1) {
    return props.achievements[0]?.description || props.achievements[0]?.name || ''
  }

  return s('Your latest import unlocked new milestones. You can review them from Notifications or the achievements page.')
})

const displayedSkippedReasons = computed(() => {
  return skippedReasons.value.slice(0, maxDisplayedReasons)
})

const diagnosticSummary = computed(() => {
  return props.diagnostics?.user_summary || props.diagnostics?.userSummary || null
})

const reasonBreakdown = computed(() => {
  return props.diagnostics?.reason_breakdown || props.diagnostics?.reasonBreakdown || []
})

const displayedReasonBreakdown = computed(() => {
  return reasonBreakdown.value.slice(0, 3)
})

const importStatus = computed(() => {
  if (props.failedTrades && props.failedTrades.length > 0) return 'error'
  if (rowsSkipped.value > 0 || (warnings.value && warnings.value.length > 0)) return 'warning'
  return 'success'
})

const title = computed(() => {
  if (props.tradesImported === 0 && props.failedTrades?.length > 0) {
    return s('Import Failed')
  }
  if (props.tradesImported === 0) {
    return s('No Trades Imported')
  }
  if (importStatus.value === 'warning') {
    return s('Import Completed with Warnings')
  }
  return s('Import Successful')
})

const iconBgClass = computed(() => {
  switch (importStatus.value) {
    case 'success': return 'bg-green-100 dark:bg-green-900'
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-900'
    default: return 'bg-red-100 dark:bg-red-900'
  }
})

const iconClass = computed(() => {
  switch (importStatus.value) {
    case 'success': return 'text-green-600 dark:text-green-400'
    case 'warning': return 'text-yellow-600 dark:text-yellow-400'
    default: return 'text-red-600 dark:text-red-400'
  }
})

const effectiveBroker = computed(() => {
  return props.diagnostics?.detectedBroker || props.selectedBroker || ''
})

const isSupportedBroker = computed(() => {
  const broker = effectiveBroker.value
  if (!broker || broker === 'auto' || broker === 'generic' || broker.startsWith('custom:')) {
    return false
  }
  return supportedBrokers.includes(broker)
})

const showNeedHelp = computed(() => {
  return props.tradesImported === 0 && isSupportedBroker.value
})

const zeroTradeReason = computed(() => {
  if (diagnosticSummary.value) {
    return {
      title: s(diagnosticSummary.value.title),
      body: s(diagnosticSummary.value.body),
      steps: (diagnosticSummary.value.steps || []).map((step) => s(step)),
    }
  }

  const totalRows = props.diagnostics?.totalRows || 0
  const skipped = rowsSkipped.value
  const failed = props.failedTrades?.length || 0

  if (failed > 0) {
    return {
      title: s('The parser found rows, but trades failed validation.'),
      body: s('This usually means one or more required values were missing or formatted differently than expected.'),
      steps: [
        s('Open failed trade details below and check the first error.'),
        s('Try Generic CSV mapping if the broker format looks different.'),
        s('Send support the detected headers if the export should be supported.'),
      ],
    }
  }

  if (totalRows > 0 && skipped >= totalRows) {
    return {
      title: s('The file had rows, but all rows were skipped.'),
      body: s('This often happens when the file is an account summary, positions export, or closed-trade report without executions.'),
      steps: [
        s('Export trade activity, fills, executions, or transaction history instead.'),
        s('Avoid positions, balances, tax, or account summary files.'),
        s('Use the support link if you are unsure which broker export to use.'),
      ],
    }
  }

  if (!props.diagnostics?.detectedBroker && props.selectedBroker === 'auto') {
    return {
      title: s('TradeTally could not recognize this export layout.'),
      body: s('The fastest path is to map the core columns or choose your broker manually before uploading.'),
      steps: [
        s('Try selecting your broker instead of Auto-Detect.'),
        s('Use Generic CSV mapping for spreadsheets or unsupported brokers.'),
        s('Load demo data if you want to explore analytics while fixing the file.'),
      ],
    }
  }

  return {
    title: s('No importable trades were found.'),
    body: s('The file uploaded successfully, but it did not contain rows TradeTally could turn into trades.'),
    steps: [
      s('Confirm the CSV contains actual trade rows.'),
      s('Try Auto-Detect if you selected a specific broker.'),
      s('Open a support ticket with the file headers if this looks like a valid export.'),
    ],
  }
})

const supportMailtoLink = computed(() => {
  const broker = effectiveBroker.value
  const brokerDisplay = formatBrokerName(broker)
  const tier = (authStore.user?.tier || 'free').charAt(0).toUpperCase() + (authStore.user?.tier || 'free').slice(1)
  const subject = encodeURIComponent(`[${tier}] Import Support: ${brokerDisplay} - 0 trades parsed`)

  const headers = props.diagnostics?.headerAnalysis?.foundHeaders?.join(', ') || 'N/A'
  const totalRows = props.diagnostics?.totalRows || 0
  const detectedBroker = props.diagnostics?.detectedBroker || 'N/A'

  const body = encodeURIComponent(
    `--- Import Details ---\n` +
    `User: ${props.userEmail || 'N/A'}\n` +
    `Selected Broker: ${formatBrokerName(props.selectedBroker) || 'N/A'}\n` +
    `Detected Broker: ${detectedBroker !== 'N/A' ? formatBrokerName(detectedBroker) : 'N/A'}\n` +
    `File Name: ${props.fileName || 'N/A'}\n` +
    `Total Rows: ${totalRows}\n` +
    `CSV Headers: ${headers}\n\n` +
    `Please describe the issue:\n\n`
  )

  return `mailto:support@tradetally.io?subject=${subject}&body=${body}`
})
</script>
