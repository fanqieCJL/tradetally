<template>
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ s('Financial Statements') }}</h2>

        <!-- Annual/Quarterly Toggle -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ s('Period:') }}</span>
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="frequency = 'annual'"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-l-md border',
                frequency === 'annual'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ s('Annual') }}
            </button>
            <button
              @click="frequency = 'quarterly'"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-r-md border-t border-b border-r',
                frequency === 'quarterly'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ s('Quarterly') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex -mb-px px-6">
        <button
          v-for="tab in localizedTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-2 text-gray-500 dark:text-gray-400">{{ error }}</p>
        <button @click="loadData" class="mt-3 text-primary-600 hover:text-primary-800 text-sm">
          {{ s('Try Again') }}
        </button>
      </div>

      <!-- Content -->
      <div v-else>
        <BalanceSheetTable
          v-if="activeTab === 'balance-sheet' && balanceSheetData"
          :data="balanceSheetData"
        />

        <IncomeStatementTable
          v-else-if="activeTab === 'income-statement' && incomeStatementData"
          :data="incomeStatementData"
        />

        <CashFlowTable
          v-else-if="activeTab === 'cash-flow' && cashFlowData"
          :data="cashFlowData"
        />

        <SECFilingsSection
          v-else-if="activeTab === 'filings' && filingsData"
          :filings="filingsData.filings"
          :symbol="symbol"
          :sec-edgar-company-url="filingsData.secEdgarCompanyUrl"
          :sec-edgar-10k-url="filingsData.secEdgar10KUrl"
          :sec-edgar-10q-url="filingsData.secEdgar10QUrl"
        />

        <div v-else-if="!loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2">{{ s('No data available') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { useInvestmentsStore } from '@/stores/investments'
import BalanceSheetTable from './BalanceSheetTable.vue'
import IncomeStatementTable from './IncomeStatementTable.vue'
import CashFlowTable from './CashFlowTable.vue'
import SECFilingsSection from './SECFilingsSection.vue'

const props = defineProps({
  symbol: {
    type: String,
    required: true
  }
})

const investmentsStore = useInvestmentsStore()
const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const tabDefs = [
  { id: 'balance-sheet', nameKey: 'Balance Sheet' },
  { id: 'income-statement', nameKey: 'Income Statement' },
  { id: 'cash-flow', nameKey: 'Cash Flow' },
  { id: 'filings', nameKey: '10-K / 10-Q Filings' }
]

const localizedTabs = computed(() =>
  tabDefs.map((tab) => ({ id: tab.id, name: s(tab.nameKey) }))
)

const activeTab = ref('balance-sheet')
const frequency = ref('annual')
const loading = ref(false)
const error = ref(null)

const balanceSheetData = ref(null)
const incomeStatementData = ref(null)
const cashFlowData = ref(null)
const filingsData = ref(null)

onMounted(() => {
  loadData()
})

watch(() => props.symbol, () => {
  balanceSheetData.value = null
  incomeStatementData.value = null
  cashFlowData.value = null
  filingsData.value = null
  loadData()
})

watch(activeTab, () => {
  loadData()
})

watch(frequency, () => {
  balanceSheetData.value = null
  incomeStatementData.value = null
  cashFlowData.value = null
  loadData()
})

async function loadData() {
  if (!props.symbol) return

  if (activeTab.value === 'balance-sheet' && balanceSheetData.value) return
  if (activeTab.value === 'income-statement' && incomeStatementData.value) return
  if (activeTab.value === 'cash-flow' && cashFlowData.value) return
  if (activeTab.value === 'filings' && filingsData.value) return

  loading.value = true
  error.value = null

  try {
    switch (activeTab.value) {
      case 'balance-sheet': {
        const bsResponse = await investmentsStore.getBalanceSheet(props.symbol, frequency.value)
        balanceSheetData.value = bsResponse?.data || []
        break
      }
      case 'income-statement': {
        const isResponse = await investmentsStore.getIncomeStatement(props.symbol, frequency.value)
        incomeStatementData.value = isResponse?.data || []
        break
      }
      case 'cash-flow': {
        const cfResponse = await investmentsStore.getCashFlow(props.symbol, frequency.value)
        cashFlowData.value = cfResponse?.data || []
        break
      }
      case 'filings':
        filingsData.value = await investmentsStore.getFilings(props.symbol)
        break
    }
  } catch (err) {
    console.error('Failed to load financial data:', err)
    error.value = s(err.response?.data?.error || 'Failed to load financial data')
  } finally {
    loading.value = false
  }
}
</script>
