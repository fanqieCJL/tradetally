/**
 * Adds i18n boilerplate and common string wraps for Metrics section views.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.join(process.cwd(), 'src')

function ensureI18nScript(content, context = 'metrics') {
  if (content.includes('tSentence')) return content
  let c = content
  if (!c.includes("from 'vue-i18n'") && !c.includes('from "vue-i18n"')) {
    c = c.replace(
      /import \{ ref([^}]*)\} from ['"]vue['"]/,
      `import { ref$1 } from 'vue'\nimport { useI18n } from 'vue-i18n'\nimport { tSentence, i18n } from '@/i18n'`
    )
  }
  const setupMatch = c.match(/<script setup>\n([\s\S]*?)(\nconst \w+ = ref)/)
  if (setupMatch && !c.includes(`context: '${context}'`)) {
    c = c.replace(
      setupMatch[2],
      `\nconst { locale } = useI18n()\nconst s = (text) => tSentence(text, { context: '${context}' })\n${setupMatch[2]}`
    )
  }
  return c
}

function applyReplacements(content, pairs) {
  let c = content
  for (const [from, to] of pairs) {
    if (!c.includes(from)) continue
    c = c.split(from).join(to)
  }
  return c
}

// --- PartialExitAnalyticsView ---
let partial = fs.readFileSync(path.join(ROOT, 'views/PartialExitAnalyticsView.vue'), 'utf8')
partial = ensureI18nScript(partial, 'metrics')
partial = applyReplacements(partial, [
  ['<h1 class="heading-page">Partial Exit Analytics</h1>', "<h1 class=\"heading-page\">{{ s('Partial Exit Analytics') }}</h1>"],
  ['Analyze how each partial exit level performs across your trades.', "{{ s('Analyze how each partial exit level performs across your trades.') }}"],
  ['<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Min Partials:</label>', "<label class=\"text-sm font-medium text-gray-700 dark:text-gray-300\">{{ s('Min Partials:') }}</label>"],
  ['<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Max Partials:</label>', "<label class=\"text-sm font-medium text-gray-700 dark:text-gray-300\">{{ s('Max Partials:') }}</label>"],
  ['<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Min Eligible Trades:</label>', "<label class=\"text-sm font-medium text-gray-700 dark:text-gray-300\">{{ s('Min Eligible Trades:') }}</label>"],
  ['<option value="">Any</option>', '<option value="">{{ s(\'Any\') }}</option>'],
  ['<button @click="loadData" class="btn-primary">Retry</button>', '<button @click="loadData" class="btn-primary">{{ s(\'Retry\') }}</button>'],
  ['<span class="text-xs text-gray-600 dark:text-gray-400">Updating...</span>', '<span class="text-xs text-gray-600 dark:text-gray-400">{{ s(\'Updating...\') }}</span>'],
  ['<div class="text-sm text-gray-600 dark:text-gray-400">Trades Analyzed</div>', '<div class="text-sm text-gray-600 dark:text-gray-400">{{ s(\'Trades Analyzed\') }}</div>'],
  ['<div class="text-sm text-gray-600 dark:text-gray-400">Max Partial Levels</div>', '<div class="text-sm text-gray-600 dark:text-gray-400">{{ s(\'Max Partial Levels\') }}</div>'],
  ['<div class="text-sm text-gray-600 dark:text-gray-400">Partial Indices</div>', '<div class="text-sm text-gray-600 dark:text-gray-400">{{ s(\'Partial Indices\') }}</div>'],
  ['                  Partial\n', '                  {{ s(\'Partial\') }}\n'],
  ['                  Eligible\n', '                  {{ s(\'Eligible\') }}\n'],
  ['                  Abs. Hit %\n', '                  {{ s(\'Abs. Hit %\') }}\n'],
  ['                  Cond. Hit %\n', '                  {{ s(\'Cond. Hit %\') }}\n'],
  ['                  Profitable\n', '                  {{ s(\'Profitable\') }}\n'],
  ['                  BE/Scratch\n', '                  {{ s(\'BE/Scratch\') }}\n'],
  ['                  Loss\n', '                  {{ s(\'Loss\') }}\n'],
  ['                  Avg Exit (pts)\n', '                  {{ s(\'Avg Exit (pts)\') }}\n'],
  ['                  Avg Exit Profit (pts)\n', '                  {{ s(\'Avg Exit Profit (pts)\') }}\n'],
  ['                  Avg R\n', '                  {{ s(\'Avg R\') }}\n'],
  ['                  Avg SL (pts)\n', '                  {{ s(\'Avg SL (pts)\') }}\n'],
  ['                      last\n', '                      {{ s(\'last\') }}\n'],
  ["error.value = err.response?.data?.error || 'Failed to load partial exit analytics'", "error.value = s(err.response?.data?.error || 'Failed to load partial exit analytics')"],
  [`? \`No partial levels have \${minEligibleTrades.value}+ eligible trades. Try lowering the threshold.\`
            : 'No partial exit data found. This analysis requires trades with at least 2 exit executions.'`, `? s(\`No partial levels have \${minEligibleTrades.value}+ eligible trades. Try lowering the threshold.\`)
            : s('No partial exit data found. This analysis requires trades with at least 2 exit executions.')`],
  ['<p>Abs. Hit % = trades where this partial was profitable / total trades analyzed.</p>', "<p>{{ s('Abs. Hit % = trades where this partial was profitable / total trades analyzed.') }}</p>"],
  ['<p>Cond. Hit % = trades where this partial was profitable given the previous partial was also profitable.</p>', "<p>{{ s('Cond. Hit % = trades where this partial was profitable given the previous partial was also profitable.') }}</p>"],
  ['<p>Only trades with 2+ exit executions are included. Trades without stop_loss show "--" for R and Avg SL columns.</p>', "<p>{{ s('Only trades with 2+ exit executions are included. Trades without stop_loss show \"--\" for R and Avg SL columns.') }}</p>"],
])
fs.writeFileSync(path.join(ROOT, 'views/PartialExitAnalyticsView.vue'), partial)
console.log('Patched PartialExitAnalyticsView')

// --- HealthAnalyticsView ---
let health = fs.readFileSync(path.join(ROOT, 'views/HealthAnalyticsView.vue'), 'utf8')
health = ensureI18nScript(health, 'metrics')
health = applyReplacements(health, [
  ['<h1 class="heading-page">Health Analytics</h1>', "<h1 class=\"heading-page\">{{ s('Health Analytics') }}</h1>"],
  ['Analyze how your health metrics correlate with trading performance', "{{ s('Analyze how your health metrics correlate with trading performance') }}"],
  ['<span v-if="loadingCorrelation">Correlating...</span>', "<span v-if=\"loadingCorrelation\">{{ s('Correlating...') }}</span>"],
  ['<span v-else>Sync Health to Trades</span>', "<span v-else>{{ s('Sync Health to Trades') }}</span>"],
  ['<p class="text-sm text-gray-500 dark:text-gray-400">Avg Heart Rate</p>', '<p class="text-sm text-gray-500 dark:text-gray-400">{{ s(\'Avg Heart Rate\') }}</p>'],
  ['<p class="text-xs text-gray-500 dark:text-gray-400">BPM</p>', '<p class="text-xs text-gray-500 dark:text-gray-400">{{ s(\'BPM\') }}</p>'],
  ['<span v-else class="text-gray-500">No change</span>', '<span v-else class="text-gray-500">{{ s(\'No change\') }}</span>'],
  ['<span class="ml-1 text-gray-500">vs last period</span>', '<span class="ml-1 text-gray-500">{{ s(\'vs last period\') }}</span>'],
  ['<p class="text-sm text-gray-500 dark:text-gray-400">Avg Sleep Score</p>', '<p class="text-sm text-gray-500 dark:text-gray-400">{{ s(\'Avg Sleep Score\') }}</p>'],
  ['<p class="text-sm text-gray-500 dark:text-gray-400">Avg Sleep Hours</p>', '<p class="text-sm text-gray-500 dark:text-gray-400">{{ s(\'Avg Sleep Hours\') }}</p>'],
  ['<p class="text-xs text-gray-500 dark:text-gray-400">hours</p>', '<p class="text-xs text-gray-500 dark:text-gray-400">{{ s(\'hours\') }}</p>'],
  ['<p class="text-sm text-gray-500 dark:text-gray-400">Avg Stress Level</p>', '<p class="text-sm text-gray-500 dark:text-gray-400">{{ s(\'Avg Stress Level\') }}</p>'],
  ['<p class="text-xs text-gray-500 dark:text-gray-400">calculated</p>', '<p class="text-xs text-gray-500 dark:text-gray-400">{{ s(\'calculated\') }}</p>'],
  ['Performance by Health Condition', "{{ s('Performance by Health Condition') }}"],
  ['                  Condition\n', '                  {{ s(\'Condition\') }}\n'],
  ['                  Trades\n', '                  {{ s(\'Trades\') }}\n'],
  ['                  Win Rate\n', '                  {{ s(\'Win Rate\') }}\n'],
  ['                  Avg P&L\n', '                  {{ s(\'Avg P&L\') }}\n'],
  ['            Personalized Health Insights\n', "            {{ s('Personalized Health Insights') }}\n"],
  ['            Refresh Insights\n', "            {{ s('Refresh Insights') }}\n"],
  ['            Collecting health data to generate insights...\n', "            {{ s('Collecting health data to generate insights...') }}\n"],
  ['                    Confidence: {{ (insight.confidence * 100).toFixed(0) }}%', "{{ s('Confidence:') }} {{ (insight.confidence * 100).toFixed(0) }}%"],
  ['                    Actionable\n', "                    {{ s('Actionable') }}\n"],
])
// Translate condition names in script
health = health.replace(
  `const conditions = [
    {
      name: 'Well Rested',`,
  `const conditions = [
    {
      name: s('Well Rested'),`
)
health = health.replace(`name: 'Sleep Deprived',`, `name: s('Sleep Deprived'),`)
health = health.replace(`description: 'Sleep > 7 hours',`, `description: s('Sleep > 7 hours'),`)
health = health.replace(`name: 'Low Stress',`, `name: s('Low Stress'),`)
health = health.replace(`description: 'Sleep < 6 hours',`, `description: s('Sleep < 6 hours'),`)
health = health.replace(`description: 'Stress < 30%',`, `description: s('Stress < 30%'),`)
health = health.replace(`name: 'High Stress',`, `name: s('High Stress'),`)
health = health.replace(`description: 'Stress > 60%',`, `description: s('Stress > 60%'),`)
health = health.replace(`name: 'Normal Heart Rate',`, `name: s('Normal Heart Rate'),`)
health = health.replace(`description: '60-80 BPM',`, `description: s('60-80 BPM'),`)
health = health.replace(`name: 'Elevated Heart Rate',`, `name: s('Elevated Heart Rate'),`)
health = health.replace(`description: '> 80 BPM',`, `description: s('> 80 BPM'),`)
health = health.replace(
  `showSuccessModal(
      'Health Data Synced',
      \`Successfully updated \${updatedCount} trade\${updatedCount !== 1 ? 's' : ''} with health data.`,
  `showSuccessModal(
      s('Health Data Synced'),
      s(\`Successfully updated \${updatedCount} trade\${updatedCount !== 1 ? 's' : ''} with health data.\`)
health = health.replace(
  `showCriticalError(
      'Sync Failed',
      'Failed to correlate health data with trades. Please try again.'`,
  `showCriticalError(
      s('Sync Failed'),
      s('Failed to correlate health data with trades. Please try again.')`
)
fs.writeFileSync(path.join(ROOT, 'views/HealthAnalyticsView.vue'), health)
console.log('Patched HealthAnalyticsView')

console.log('Done partial metrics patches')
