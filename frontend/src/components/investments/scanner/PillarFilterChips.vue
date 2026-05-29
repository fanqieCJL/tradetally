<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ s('Filter by Pillars (select which must pass):') }}
      </label>
      <button
        v-if="selectedPillars.length > 0"
        @click="clearFilters"
        class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
      >
        {{ s('Clear filters') }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="pillar in 8"
        :key="pillar"
        @click="togglePillar(pillar)"
        :class="[
          'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          selectedPillars.includes(pillar)
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        <span class="mr-1.5 text-xs opacity-75">{{ pillar }}.</span>
        {{ pillarLabel(pillar) }}
        <svg
          v-if="selectedPillars.includes(pillar)"
          class="ml-1.5 w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>

    <p v-if="selectedPillars.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
      {{ filterSummary }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { useScannerStore } from '@/stores/scanner'

const scannerStore = useScannerStore()
const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const selectedPillars = computed(() => scannerStore.selectedPillars)

const filterSummary = computed(() => {
  void locale.value
  const pillars = formatSelectedPillars()
  const key =
    selectedPillars.value.length === 1
      ? 'Showing stocks where pillar {pillars} must pass'
      : 'Showing stocks where pillars {pillars} must pass'
  return s(key).replace('{pillars}', pillars)
})

function pillarLabel(pillar) {
  return s(scannerStore.pillarShortNames[pillar])
}

function togglePillar(pillar) {
  scannerStore.togglePillar(pillar)
}

function clearFilters() {
  scannerStore.clearFilters()
}

function formatSelectedPillars() {
  const sorted = [...selectedPillars.value].sort((a, b) => a - b)
  if (sorted.length === 1) return String(sorted[0])
  if (sorted.length === 2) {
    return `${sorted[0]}${s(' and ')}${sorted[1]}`
  }
  const last = sorted.pop()
  return `${sorted.join(', ')}${s(', and ')}${last}`
}
</script>
