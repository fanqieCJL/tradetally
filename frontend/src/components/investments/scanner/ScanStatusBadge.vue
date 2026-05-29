<template>
  <div class="inline-flex items-center space-x-2 text-sm">
    <template v-if="scanStatus?.status === 'running'">
      <div class="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>
          {{ s('Scanning...') }} {{ scanStatus.progress || 0 }}%
          <span class="text-gray-500 dark:text-gray-400">
            ({{ scanStatus.stocksAnalyzed || 0 }}/{{ scanStatus.totalStocks || 0 }})
          </span>
        </span>
      </div>
    </template>

    <template v-else-if="scanInfo">
      <span class="text-gray-500 dark:text-gray-400">
        {{ s('Last scan:') }} {{ formatDate(scanInfo.completedAt) }}
      </span>
      <span class="text-gray-400 dark:text-gray-500">|</span>
      <span class="text-gray-500 dark:text-gray-400">
        {{ stocksAnalyzedLabel }}
      </span>
    </template>

    <template v-else-if="scanStatus?.status === 'no_scans'">
      <span class="text-gray-500 dark:text-gray-400">
        {{ s('No scans yet. Stock scans run quarterly or can be triggered by admin.') }}
      </span>
    </template>

    <template v-else-if="scanStatus?.status === 'failed'">
      <span class="text-red-600 dark:text-red-400">
        {{ s('Last scan failed') }}
      </span>
    </template>

    <button
      v-if="isAdmin && scanStatus?.status !== 'running'"
      @click="triggerScan"
      :disabled="triggering"
      class="ml-4 px-2 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50"
    >
      {{ triggering ? s('Starting...') : s('Trigger Scan') }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { useScannerStore } from '@/stores/scanner'
import { useAuthStore } from '@/stores/auth'
import { useUserTimezone } from '@/composables/useUserTimezone'

const { formatDateTime: formatDateTimeTz } = useUserTimezone()

const scannerStore = useScannerStore()
const authStore = useAuthStore()
const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const triggering = ref(false)
let pollInterval = null

const scanStatus = computed(() => scannerStore.scanStatus)
const scanInfo = computed(() => scannerStore.scanInfo)
const isAdmin = computed(() => authStore.user?.role === 'admin' || authStore.user?.role === 'owner')

const stocksAnalyzedLabel = computed(() => {
  void locale.value
  const count = scanInfo.value?.stocksAnalyzed?.toLocaleString() ?? '0'
  return s('{count} stocks analyzed').replace('{count}', count)
})

onMounted(async () => {
  try {
    await scannerStore.fetchStatus()
    if (scanStatus.value?.status === 'running') {
      startPolling()
    }
  } catch {
    // optional
  }
})

onUnmounted(() => {
  stopPolling()
})

watch(() => scanStatus.value?.status, (newStatus) => {
  if (newStatus === 'running') {
    startPolling()
  } else {
    stopPolling()
  }
})

async function triggerScan() {
  triggering.value = true
  try {
    await scannerStore.triggerScan()
    startPolling()
  } catch (err) {
    console.error('Failed to trigger scan:', err)
  } finally {
    triggering.value = false
  }
}

function startPolling() {
  if (pollInterval) return

  pollInterval = setInterval(async () => {
    try {
      await scannerStore.fetchStatus()
      await scannerStore.fetchResults(scannerStore.pagination.page)

      if (scanStatus.value?.status !== 'running') {
        stopPolling()
      }
    } catch (err) {
      console.error('Polling error:', err)
    }
  }, 5000)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return s('Never')
  try {
    return formatDateTimeTz(dateStr)
  } catch {
    return dateStr
  }
}
</script>
