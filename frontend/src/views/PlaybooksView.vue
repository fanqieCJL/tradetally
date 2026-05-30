<template>
  <div class="content-wrapper py-8 space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="heading-page">{{ s('Playbooks') }}</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ s('Define structured setups, review trades against them, and measure plan adherence.') }}
        </p>
      </div>
      <div class="flex gap-3">
        <button @click="resetForm" class="btn-secondary">
          {{ s('New Playbook') }}
        </button>
        <button @click="loadData" class="btn-primary" :disabled="loading">
          {{ loading ? s('Refreshing...') : s('Refresh') }}
        </button>
      </div>
    </div>

    <div v-if="loading && playbooks.length === 0" class="card">
      <div class="card-body py-12 text-center text-gray-500 dark:text-gray-400">
        {{ s('Loading playbooks...') }}
      </div>
    </div>

    <div v-else class="grid gap-8 xl:grid-cols-[1.1fr_1.2fr]">
      <div class="space-y-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ s('Saved Playbooks') }}</h2>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ s('{count} total').replace('{count}', String(playbooks.length)) }}</span>
            </div>

            <div v-if="playbooks.length === 0" class="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400">
              {{ s('No structured playbooks yet. Create one to start scoring trades against a defined setup.') }}
            </div>

            <div v-else class="space-y-3">
              <button
                v-for="playbook in playbooks"
                :key="playbook.id"
                @click="selectPlaybook(playbook)"
                class="w-full text-left rounded-xl border px-4 py-4 transition"
                :class="selectedPlaybookId === playbook.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ playbook.name }}</h3>
                      <span
                        class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                        :class="playbook.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                      >
                        {{ playbook.isActive ? s('Active') : s('Archived') }}
                      </span>
                    </div>
                    <p v-if="playbook.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ playbook.description }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2 text-xs">
                      <span v-if="playbook.side && playbook.side !== 'both'" class="rounded-full bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {{ formatEnum(playbook.side) }}
                      </span>
                      <span v-if="playbook.timeframe" class="rounded-full bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {{ formatEnum(playbook.timeframe) }}
                      </span>
                      <span class="rounded-full bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {{ checklistItemsLabel(playbook.checklistItems.length) }}
                      </span>
                      <span v-if="playbook.requireStopLoss" class="rounded-full bg-orange-100 px-2 py-1 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                        {{ s('Stop required') }}
                      </span>
                      <span v-if="playbook.minimumTargetR !== null" class="rounded-full bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {{ minRLabel(playbook.minimumTargetR) }}
                      </span>
                    </div>
                  </div>

                  <div class="text-right text-xs text-gray-500 dark:text-gray-400">
                    <div>{{ reviewsLabel(playbookAnalyticsMap[playbook.id]?.reviewed_trade_count || 0) }}</div>
                    <div>{{ avgAdherenceLabel(playbookAnalyticsMap[playbook.id]?.adherence_average || '0.00') }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ s('Adherence Analytics') }}</h2>
              <router-link to="/trades" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                {{ s('Review trades') }}
              </router-link>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ s('Active playbooks') }}</div>
                <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview.active_playbook_count || 0 }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ s('Reviewed trades') }}</div>
                <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview.reviewed_trade_count || 0 }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ s('Avg adherence') }}</div>
                <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview.adherence_average || '0.00' }}</div>
              </div>
              <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ s('Followed vs broken') }}</div>
                <div class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {{ analytics.overview.followed_trade_count || 0 }} / {{ analytics.overview.broken_trade_count || 0 }}
                </div>
              </div>
            </div>

            <div v-if="analytics.playbooks.length > 0" class="mt-6 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr class="text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th class="py-3 pr-4">{{ s('Playbook') }}</th>
                    <th class="py-3 pr-4">{{ s('Reviewed') }}</th>
                    <th class="py-3 pr-4">{{ s('Win Rate') }}</th>
                    <th class="py-3 pr-4">{{ s('Profit Factor') }}</th>
                    <th class="py-3 pr-4">{{ s('Avg R') }}</th>
                    <th class="py-3">{{ s('Adherence') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                  <tr v-for="row in analytics.playbooks" :key="row.id">
                    <td class="py-3 pr-4 font-medium text-gray-900 dark:text-white">{{ row.name }}</td>
                    <td class="py-3 pr-4">{{ row.reviewed_trade_count }}</td>
                    <td class="py-3 pr-4">{{ Number(row.win_rate || 0).toFixed(1) }}%</td>
                    <td class="py-3 pr-4">{{ Number(row.profit_factor || 0).toFixed(2) }}</td>
                    <td class="py-3 pr-4">{{ Number(row.avg_r || 0).toFixed(2) }}R</td>
                    <td class="py-3">{{ Number(row.adherence_average || 0).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="analytics.recentTrades.length > 0" class="mt-6">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">{{ s('Recent Reviews') }}</h3>
              <div class="space-y-3">
                <div
                  v-for="review in analytics.recentTrades"
                  :key="review.trade_id"
                  class="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm"
                >
                  <div>
                    <router-link :to="`/trades/${review.trade_id}`" class="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                      {{ review.symbol }}
                    </router-link>
                    <div class="text-gray-500 dark:text-gray-400">{{ formatDate(review.trade_date) }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900 dark:text-white">{{ Number(review.adherence_score || 0).toFixed(2) }}</div>
                    <div :class="review.followed_plan ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ review.followed_plan ? s('Followed plan') : s('Broke plan') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card h-fit">
        <div class="card-body space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ form.id ? s('Edit Playbook') : s('Create Playbook') }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ s('Set a checklist and a few hard rules that should always hold for this setup.') }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="form.id"
                type="button"
                @click="archivePlaybook({ id: form.id, name: form.name })"
                class="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                {{ s('Archive') }}
              </button>
              <button v-if="form.id" @click="resetForm" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {{ s('Clear') }}
              </button>
            </div>
          </div>

          <form @submit.prevent="savePlaybook" class="space-y-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Name') }}</label>
                <input v-model="form.name" type="text" class="input" maxlength="120" required />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Description') }}</label>
                <textarea v-model="form.description" rows="3" class="input"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Market') }}</label>
                <input v-model="form.market" type="text" class="input" :placeholder="s('Small caps, options, etc.')" maxlength="50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Side') }}</label>
                <select v-model="form.side" class="input">
                  <option value="both">{{ s('Both') }}</option>
                  <option value="long">{{ s('long') }}</option>
                  <option value="short">{{ s('short') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Timeframe') }}</label>
                <select v-model="form.timeframe" class="input">
                  <option value="">{{ s('Any') }}</option>
                  <option value="scalper">{{ s('Scalper') }}</option>
                  <option value="day_trading">{{ s('Day Trading') }}</option>
                  <option value="swing">{{ s('Swing') }}</option>
                  <option value="position">{{ s('Position') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Minimum Target R') }}</label>
                <input v-model.number="form.minimumTargetR" type="number" min="0" step="0.25" class="input" :placeholder="s('Optional')" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Required Strategy') }}</label>
                <input v-model="form.requiredStrategy" type="text" class="input" maxlength="100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Required Setup') }}</label>
                <input v-model="form.requiredSetup" type="text" class="input" maxlength="100" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ s('Required Tags') }}</label>
                <input v-model="requiredTagsInput" type="text" class="input" :placeholder="s('Comma-separated tags')" />
              </div>
              <label class="inline-flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 md:col-span-2">
                <input v-model="form.requireStopLoss" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ s('Require stop loss for a passing review') }}</span>
              </label>
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ s('Checklist') }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ s('These items are scored directly before hard-rule penalties are applied.') }}</p>
                </div>
                <button type="button" @click="addChecklistItem" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  {{ s('Add item') }}
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(item, index) in form.checklistItems"
                  :key="`${item.localId}-${index}`"
                  class="rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div class="grid gap-3 md:grid-cols-[1fr_120px_120px_auto]">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{ s('Label') }}</label>
                      <input v-model="item.label" type="text" class="input" maxlength="255" required />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{ s('Weight') }}</label>
                      <input v-model.number="item.weight" type="number" min="0.25" step="0.25" class="input" required />
                    </div>
                    <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-6">
                      <input v-model="item.isRequired" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      {{ s('Required') }}
                    </label>
                    <div class="flex items-end justify-end">
                      <button type="button" @click="removeChecklistItem(index)" class="text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                        {{ s('Remove') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ s('Hard rules evaluate side, timeframe, stop loss, minimum target R, and optional strategy/setup/tag matching.') }}
              </p>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? s('Saving...') : (form.id ? s('Save Playbook') : s('Create Playbook')) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { tSentence } from '@/i18n'
import { formatAppDate } from '@/utils/date'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })
void locale

const { showSuccess, showError, showConfirmation } = useNotification()

const loading = ref(true)
const saving = ref(false)
const playbooks = ref([])
const analytics = ref({
  overview: {},
  playbooks: [],
  recentTrades: []
})
const selectedPlaybookId = ref(null)
const requiredTagsInput = ref('')

const ENUM_LABELS = {
  both: 'Both',
  long: 'long',
  short: 'short',
  scalper: 'Scalper',
  day_trading: 'Day Trading',
  swing: 'Swing',
  position: 'Position'
}

let checklistLocalId = 0

function createChecklistItem() {
  checklistLocalId += 1
  return {
    localId: checklistLocalId,
    label: '',
    itemOrder: null,
    weight: 1,
    isRequired: false
  }
}

const form = reactive({
  id: null,
  name: '',
  description: '',
  market: '',
  timeframe: '',
  side: 'both',
  requiredStrategy: '',
  requiredSetup: '',
  requireStopLoss: false,
  minimumTargetR: null,
  checklistItems: [createChecklistItem()]
})

const playbookAnalyticsMap = computed(() => {
  return analytics.value.playbooks.reduce((map, row) => {
    map[row.id] = row
    return map
  }, {})
})

function checklistItemsLabel(count) {
  return count === 1
    ? s('1 checklist item')
    : s('{count} checklist items').replace('{count}', String(count))
}

function reviewsLabel(count) {
  return s('{count} reviews').replace('{count}', String(count))
}

function avgAdherenceLabel(score) {
  return s('{score} avg adherence').replace('{score}', score)
}

function minRLabel(r) {
  return s('Min {r}R').replace('{r}', Number(r).toFixed(1))
}

function resetForm() {
  selectedPlaybookId.value = null
  requiredTagsInput.value = ''
  form.id = null
  form.name = ''
  form.description = ''
  form.market = ''
  form.timeframe = ''
  form.side = 'both'
  form.requiredStrategy = ''
  form.requiredSetup = ''
  form.requireStopLoss = false
  form.minimumTargetR = null
  form.checklistItems = [createChecklistItem()]
}

function selectPlaybook(playbook) {
  selectedPlaybookId.value = playbook.id
  requiredTagsInput.value = (playbook.requiredTags || []).join(', ')
  form.id = playbook.id
  form.name = playbook.name
  form.description = playbook.description || ''
  form.market = playbook.market || ''
  form.timeframe = playbook.timeframe || ''
  form.side = playbook.side || 'both'
  form.requiredStrategy = playbook.requiredStrategy || ''
  form.requiredSetup = playbook.requiredSetup || ''
  form.requireStopLoss = playbook.requireStopLoss === true
  form.minimumTargetR = playbook.minimumTargetR
  form.checklistItems = (playbook.checklistItems || []).map((item, index) => ({
    localId: item.id || `${playbook.id}-${index}`,
    label: item.label,
    itemOrder: item.itemOrder ?? index,
    weight: item.weight ?? 1,
    isRequired: item.isRequired === true
  }))

  if (form.checklistItems.length === 0) {
    form.checklistItems = [createChecklistItem()]
  }
}

function addChecklistItem() {
  form.checklistItems.push(createChecklistItem())
}

function removeChecklistItem(index) {
  if (form.checklistItems.length === 1) {
    form.checklistItems = [createChecklistItem()]
    return
  }

  form.checklistItems.splice(index, 1)
}

async function loadData() {
  try {
    loading.value = true
    const [playbookResponse, analyticsResponse] = await Promise.all([
      api.get('/playbooks', { params: { includeArchived: true } }),
      api.get('/playbooks/analytics')
    ])

    playbooks.value = playbookResponse.data.playbooks || []
    analytics.value = analyticsResponse.data

    if (selectedPlaybookId.value) {
      const selected = playbooks.value.find(playbook => playbook.id === selectedPlaybookId.value)
      if (selected) {
        selectPlaybook(selected)
      }
    }
  } catch (error) {
    console.error('Failed to load playbooks:', error)
    showError(s('Error'), s('Failed to load playbooks'))
  } finally {
    loading.value = false
  }
}

async function savePlaybook() {
  if (!form.name.trim()) {
    showError(s('Validation'), s('Playbook name is required'))
    return
  }

  const checklistItems = form.checklistItems
    .map((item, index) => ({
      label: item.label.trim(),
      itemOrder: index,
      weight: Number(item.weight) || 1,
      isRequired: item.isRequired === true
    }))
    .filter(item => item.label)

  if (checklistItems.length === 0) {
    showError(s('Validation'), s('Add at least one checklist item'))
    return
  }

  const payload = {
    name: form.name.trim(),
    description: form.description.trim() || null,
    market: form.market.trim() || null,
    timeframe: form.timeframe || null,
    side: form.side || 'both',
    requiredStrategy: form.requiredStrategy.trim() || null,
    requiredSetup: form.requiredSetup.trim() || null,
    requiredTags: requiredTagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean),
    requireStopLoss: form.requireStopLoss === true,
    minimumTargetR: form.minimumTargetR === null || form.minimumTargetR === '' ? null : Number(form.minimumTargetR),
    checklistItems
  }

  try {
    saving.value = true

    if (form.id) {
      await api.put(`/playbooks/${form.id}`, payload)
      showSuccess(s('Success'), s('Playbook updated'))
    } else {
      const response = await api.post('/playbooks', payload)
      selectedPlaybookId.value = response.data.playbook?.id || null
      showSuccess(s('Success'), s('Playbook created'))
    }

    await loadData()
  } catch (error) {
    console.error('Failed to save playbook:', error)
    showError(s('Error'), s(error.response?.data?.error || 'Failed to save playbook'))
  } finally {
    saving.value = false
  }
}

function archivePlaybook(playbook) {
  showConfirmation(
    s('Archive Playbook'),
    s('Archive "{name}"? It will stay in analytics and existing reviews but won’t be selectable for new reviews.').replace('{name}', playbook.name),
    async () => {
      try {
        await api.delete(`/playbooks/${playbook.id}`)
        showSuccess(s('Success'), s('Playbook archived'))
        if (selectedPlaybookId.value === playbook.id) {
          resetForm()
        }
        await loadData()
      } catch (error) {
        console.error('Failed to archive playbook:', error)
        showError(s('Error'), s(error.response?.data?.error || 'Failed to archive playbook'))
      }
    }
  )
}

function formatEnum(value) {
  if (!value) return ''
  if (ENUM_LABELS[value]) return s(ENUM_LABELS[value])
  return String(value)
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDate(value) {
  if (!value) return s('N/A')
  return formatAppDate(value) || s('N/A')
}

onMounted(loadData)
</script>
