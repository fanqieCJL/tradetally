<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 transition-opacity" @click="emit('close')"></div>

      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ s('Connect Interactive Brokers') }}
          </h3>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h4 class="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">{{ s('Setup Instructions') }}</h4>
            <ol class="text-sm text-primary-700 dark:text-primary-400 space-y-2 list-decimal list-inside">
              <li>
                {{ s('Log in to') }}
                <a href="https://www.interactivebrokers.com/sso/Login" target="_blank" class="underline font-medium">{{ s('IBKR Client Portal') }}</a>
              </li>
              <li>
                {{ s('Navigate to') }}
                <strong>{{ s('Performance & Reports > Flex Queries') }}</strong>
              </li>
              <li>{{ s('Under "Activity Flex Query", click the + button to create a new query') }}</li>
              <li>{{ s('Name your query, select Trades in the Sections, then Save') }}</li>
              <li>{{ s('Note the Query ID shown next to your saved query') }}</li>
              <li>{{ s('Click the gear icon next to "Configure Flex Web Service"') }}</li>
              <li>{{ s('Generate or copy your Current Token') }}</li>
            </ol>
            <p class="mt-3 text-xs text-primary-600 dark:text-primary-400">
              <a href="https://www.interactivebrokers.com/en/software/am/am/reports/activityflexqueries.htm" target="_blank" class="underline">{{ s("View IBKR's official Flex Query documentation") }}</a>
            </p>
          </div>

          <div v-if="props.error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <p class="ml-3 text-sm text-red-700 dark:text-red-300">{{ props.error }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="accountLabel" class="label">{{ s('Account Label') }}</label>
              <input
                id="accountLabel"
                v-model="form.accountLabel"
                type="text"
                class="input"
                :placeholder="s('e.g., Main Account, Paper Trading')"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ s('Optional name to identify this account') }}
              </p>
            </div>

            <div>
              <label for="flexToken" class="label">{{ s('Flex Token') }}</label>
              <input
                id="flexToken"
                v-model="form.flexToken"
                type="password"
                class="input"
                :placeholder="s('Enter your Flex Token')"
                required
              />
            </div>

            <div>
              <label for="flexQueryId" class="label">{{ s('Flex Query ID') }}</label>
              <input
                id="flexQueryId"
                v-model="form.flexQueryId"
                type="text"
                class="input"
                :placeholder="s('e.g., 123456')"
                required
              />
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white">
                  {{ s('Auto-Sync') }}
                </label>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ s('Automatically sync trades daily') }}
                </p>
              </div>
              <button
                type="button"
                @click="form.autoSyncEnabled = !form.autoSyncEnabled"
                :class="[
                  form.autoSyncEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    form.autoSyncEnabled ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  ]"
                />
              </button>
            </div>

            <div v-if="form.autoSyncEnabled">
              <label for="syncTime" class="label">{{ s('Sync Time') }}</label>
              <input
                id="syncTime"
                v-model="form.syncTime"
                type="time"
                class="input"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ s('Time to automatically sync each day (in your local timezone)') }}
              </p>
            </div>

            <div>
              <label class="label">{{ s('Sync Trades From') }}</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <button
                  v-for="preset in syncRangePresets"
                  :key="preset.id"
                  type="button"
                  @click="applySyncRangePreset(preset.id)"
                  :class="[
                    'px-3 py-1 text-sm rounded-full border transition-colors',
                    activePreset === preset.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ s(preset.label) }}
                </button>
              </div>
              <AppDateInput
                v-if="activePreset === 'custom'"
                v-model="form.syncStartDate"
                :max="todayIso"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ s('Only sync trades on or after this date. Leave as "All Time" to import the full history available from the broker.') }}
              </p>
            </div>
          </form>
        </div>

        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="emit('close')"
            class="btn-secondary"
          >
            {{ s('Cancel') }}
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading || !isValid"
            class="btn-primary"
          >
            <span v-if="loading" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ s('Connecting...') }}
            </span>
            <span v-else>{{ s('Connect') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import AppDateInput from '@/components/common/AppDateInput.vue'
import { syncRangePresets, applyPresetToForm, todayIso } from '@/utils/syncRangePresets'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'save'])

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const form = ref({
  accountLabel: '',
  flexToken: '',
  flexQueryId: '',
  autoSyncEnabled: true,
  syncFrequency: 'daily',
  syncTime: '06:00',
  syncStartDate: null
})

const activePreset = ref('all')

function applySyncRangePreset(presetId) {
  activePreset.value = presetId
  applyPresetToForm(form.value, presetId)
}

const isValid = computed(() => {
  return form.value.flexToken.length > 0 && form.value.flexQueryId.length > 0
})

function handleSubmit() {
  if (!isValid.value) return

  emit('save', {
    accountLabel: form.value.accountLabel,
    flexToken: form.value.flexToken,
    flexQueryId: form.value.flexQueryId,
    autoSyncEnabled: form.value.autoSyncEnabled,
    syncFrequency: form.value.syncFrequency,
    syncTime: form.value.syncTime + ':00',
    syncStartDate: form.value.syncStartDate
  })
}
</script>
