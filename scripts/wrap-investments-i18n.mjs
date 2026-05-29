/**
 * Wrap Investments UI strings with s()
 * Run: node scripts/wrap-investments-i18n.mjs
 */
import fs from 'fs'
import path from 'path'

const root = process.cwd()

function patchFile(relPath, patches) {
  const filePath = path.join(root, relPath)
  let content = fs.readFileSync(filePath, 'utf8')
  for (const [from, to] of patches) {
    if (content.includes(from) && !content.includes(to.slice(0, Math.min(30, to.length)))) {
      content = content.split(from).join(to)
    }
  }
  fs.writeFileSync(filePath, content)
}

// InvestmentsView.vue
const invView = 'frontend/src/views/InvestmentsView.vue'
let inv = fs.readFileSync(path.join(root, invView), 'utf8')
if (!inv.includes('useI18n')) {
  inv = inv.replace(
    'import { ref, computed, onMounted, watch } from "vue";',
    'import { ref, computed, onMounted, watch } from "vue";\nimport { useI18n } from "vue-i18n";\nimport { tSentence } from "@/i18n";'
  )
  inv = inv.replace(
    'const { showSuccess, showError } = useNotification();',
    'const { showSuccess, showError } = useNotification();\nconst { locale } = useI18n();\nconst s = (text) => tSentence(text, { context: "metrics" });\nvoid locale;'
  )
}

const invSingles = [
  'Investments', 'Analyze stocks and track your portfolio', 'Add Position',
  'Stock Screener', 'Holdings', 'Stock Scanner', 'Analyzing...', 'Analyze',
  'Recent Searches', 'Showing Favorites', 'Show Favorites', 'No analysis yet',
  'Total Value', 'Unrealized P&L', 'Total Dividends', 'Positions',
  'Your Holdings', 'Refreshing...', 'Refresh Prices', 'Symbol', 'Shares',
  'Avg Cost', 'Current', 'Value', 'Actions', 'Open Trade', 'traded', 'View',
  'View Trades', 'Delete', 'No holdings yet', 'Add Your First Position',
  '8 Pillars Stock Scanner', 'No scan data available', 'Delete Holding', 'Cancel',
  'Adding...', 'Add to Watchlist', 'Default', 'Loading...', 'Current Price',
]
for (const text of invSingles.sort((a, b) => b.length - a.length)) {
  const esc = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(>)\\s*${esc}\\s*(</)`, 'g')
  inv = inv.replace(re, (m, a, b) => {
    if (m.includes("s('") || m.includes('{{')) return m
    return `${a}{{ s('${text.replace(/'/g, "\\'")}') }}${b}`
  })
}

inv = inv.replace(
  `Enter a stock symbol above to analyze using the 8 Pillars
                    methodology.`,
  `{{ s('Enter a stock symbol above to analyze using the 8 Pillars methodology.') }}`
)
inv = inv.replace(
  `Start tracking your long-term investments.`,
  `{{ s('Start tracking your long-term investments.') }}`
)
inv = inv.replace(
  `Find US stocks that pass the 8 Pillars value
                                investing criteria`,
  `{{ s('Find US stocks that pass the 8 Pillars value investing criteria') }}`
)
inv = inv.replace(
  `Stock scans run quarterly. Admins can trigger a scan
                            manually.`,
  `{{ s('Stock scans run quarterly. Admins can trigger a scan manually.') }}`
)
inv = inv.replace(
  `Are you sure you want to delete your
                    {{ holdingToDelete.symbol }} position? This will also delete
                    all lots and dividend history.`,
  `{{ s('Are you sure you want to delete your {symbol} position? This will also delete all lots and dividend history.').replace('{symbol}', holdingToDelete.symbol) }}`
)
inv = inv.replace(
  'Add {{ symbolToAddToWatchlist }} to Watchlist',
  "{{ s('Add {symbol} to Watchlist').replace('{symbol}', symbolToAddToWatchlist) }}"
)
inv = inv.replace(
  `You don't have any watchlists yet.`,
  `{{ s("You don't have any watchlists yet.") }}`
)
inv = inv.replace(
  'Create your first watchlist',
  "{{ s('Create your first watchlist') }}"
)
inv = inv.replace(
  'placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"',
  ':placeholder="s(\'Enter stock symbol (e.g., AAPL, MSFT, GOOGL)\')"'
)
inv = inv.replace('showError("Error", "Failed to load watchlists")', 'showError(s("Error"), s("Failed to load watchlists"))')
inv = inv.replace('showSuccess(\n            "Added to Watchlist",', 'showSuccess(\n            s("Added to Watchlist"),')
inv = inv.replace(
  '`${symbolToAddToWatchlist.value} has been added to ${watchlistName}`,',
  's("{symbol} has been added to {watchlist}").replace("{symbol}", symbolToAddToWatchlist.value).replace("{watchlist}", watchlistName),'
)
inv = inv.replace('showError(\n                "Already in Watchlist",', 'showError(\n                s("Already in Watchlist"),')
inv = inv.replace(
  '`${symbolToAddToWatchlist.value} is already in this watchlist`,',
  's("{symbol} is already in this watchlist").replace("{symbol}", symbolToAddToWatchlist.value),'
)
inv = inv.replace('showError("Error", "Failed to add symbol to watchlist")', 'showError(s("Error"), s("Failed to add symbol to watchlist"))')
inv = inv.replace('return "N/A";', 'return s("N/A");')
inv = inv.replace(
  /\?\s*`Analyzed \$\{topMissedTrades/,
  '? `Analyzed'
) // skip wrong file

fs.writeFileSync(path.join(root, invView), inv)

// EightPillarsCard
patchFile('frontend/src/components/investments/EightPillarsCard.vue', [
  [`<script setup>\nimport PillarBadge`, `<script setup>\nimport { useI18n } from 'vue-i18n'\nimport { tSentence } from '@/i18n'\nimport PillarBadge`],
  ['import PillarBadge from', 'const { locale } = useI18n()\nconst s = (text) => tSentence(text, { context: \'metrics\' })\nvoid locale\n\nimport PillarBadge from'],
])
let ep = fs.readFileSync(path.join(root, 'frontend/src/components/investments/EightPillarsCard.vue'), 'utf8')
;['Pillars Passed', 'View Details', 'Add to Watchlist', 'Add to Holdings', 'Growing', 'Declining'].forEach((text) => {
  ep = ep.replace(new RegExp(`>${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`), `>{{ s('${text.replace(/'/g, "\\'")}') }}<`)
})
ep = ep.replace(':name="analysis.pillars.pillar1.name"', ':name="s(analysis.pillars.pillar1.name)"')
for (let i = 2; i <= 8; i++) {
  ep = ep.replaceAll(`:name="analysis.pillars.pillar${i}.name"`, `:name="s(analysis.pillars.pillar${i}.name)"`)
}
fs.writeFileSync(path.join(root, 'frontend/src/components/investments/EightPillarsCard.vue'), ep)

console.log('Done investments i18n wrap (partial — review InvestmentsView)')
