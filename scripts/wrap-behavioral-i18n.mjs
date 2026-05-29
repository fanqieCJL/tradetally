/**
 * Wrap BehavioralAnalyticsView.vue static strings with s().
 * Run: node scripts/wrap-behavioral-i18n.mjs
 */
import fs from 'fs'
import path from 'path'

const filePath = path.join(
  process.cwd(),
  'frontend/src/views/BehavioralAnalyticsView.vue'
)
let content = fs.readFileSync(filePath, 'utf8')

if (!content.includes('useI18n')) {
  content = content.replace(
    'import { useRouter, useRoute } from "vue-router";',
    'import { useRouter, useRoute } from "vue-router";\nimport { useI18n } from "vue-i18n";\nimport { tSentence, i18n } from "@/i18n";'
  )
  content = content.replace(
    'const { showSuccess, showError } = useNotification();',
    'const { showSuccess, showError } = useNotification();\nconst { locale } = useI18n();\nconst s = (text) => tSentence(text, { context: "metrics" });'
  )
}

function alreadyWrapped(text) {
  const q = text.replace(/'/g, "\\'")
  return content.includes(`s('${q}')`) || content.includes(`s("${text}")`)
}

function wrapText(text) {
  return `{{ s('${text.replace(/'/g, "\\'")}') }}`
}

/** Longest-first literal replacements */
const pairs = [
  [
    'title="Behavioral Analytics"\n            description="Detect revenge trading, overtrading, and FOMO patterns. Understand your psychological edge."\n            cta-label="Next: Watchlists"',
    ':title="s(\'Behavioral Analytics\')"\n            :description="s(\'Detect revenge trading, overtrading, and FOMO patterns. Understand your psychological edge.\')"\n            :cta-label="s(\'Next: Watchlists\')"'
  ],
  [
    `Analyze your trading behavior patterns and emotional
                decision-making`,
    `{{ s('Analyze your trading behavior patterns and emotional decision-making') }}`
  ],
  [
    `To generate your trading personality profile, you
                            need at least 20 completed trades. This helps us
                            analyze your patterns and provide meaningful
                            insights.`,
    `{{ s('To generate your trading personality profile, you need at least 20 completed trades. This helps us analyze your patterns and provide meaningful insights.') }}`
  ],
  [
    `Keep trading and check back once you've reached this
                            milestone!`,
    `{{ s("Keep trading and check back once you've reached this milestone!") }}`
  ],
  [
    `Great job! We haven't detected any revenge trading
                            patterns in the selected time period.`,
    `{{ s("Great job! We haven't detected any revenge trading patterns in the selected time period.") }}`
  ],
  [
    `Median Hold Time (You vs Peers vs
                                        Optimal)`,
    `{{ s('Median Hold Time (You vs Peers vs Optimal)') }}`
  ],
  [
    `Shows specific trades where you exited early and
                                left money on the table.`,
    `{{ s('Shows specific trades where you exited early and left money on the table.') }}`
  ],
  [
    `Reveals your behavioral patterns - do you hold
                                losers longer than winners?`,
    `{{ s('Reveals your behavioral patterns - do you hold losers longer than winners?') }}`
  ],
  [
    `Identifies psychological patterns: Do you hold
                                losers too long and exit winners too early?`,
    `{{ s('Identifies psychological patterns: Do you hold losers too long and exit winners too early?') }}`
  ],
  [
    `Specific trades where you left money on the
                                table by exiting too early`,
    `{{ s('Specific trades where you left money on the table by exiting too early') }}`
  ],
  [
    `Click "Analyze Overconfidence" to detect win streak
                            patterns.`,
    `{{ s('Click "Analyze Overconfidence" to detect win streak patterns.') }}`
  ],
  [
    'Click "Analyze Exit Patterns" to generate analysis.',
    "{{ s('Click \"Analyze Exit Patterns\" to generate analysis.') }}"
  ],
  ['<span v-else> Analyze Historical Trades </span>', '<span v-else>{{ s(\'Analyze Historical Trades\') }}</span>'],
  ['Analyzing Historical Trades...', "{{ s('Analyzing Historical Trades...') }}"],
  ['{{ alert.title }}', '{{ s(alert.title) }}'],
  ['{{ alert.message }}', '{{ s(alert.message) }}'],
  [
    `? "Analyzing..."\n                                    : "Refresh Analysis"`,
    `? s("Analyzing...")\n                                    : s("Refresh Analysis")`
  ],
  [
    `? "Analyzing..."\n                                    : "Analyze Exit Patterns"`,
    `? s("Analyzing...")\n                                    : s("Analyze Exit Patterns")`
  ],
  [
    `? "Analyzing..."\n                                        : "Find Early Exit Trades"`,
    `? s("Analyzing...")\n                                        : s("Find Early Exit Trades")`
  ],
  [
    'loadingOverconfidence\n                                    ? "Analyzing..."\n                                    : "Analyze Overconfidence"',
    'loadingOverconfidence\n                                    ? s("Analyzing...")\n                                    : s("Analyze Overconfidence")'
  ],
  ['\n                Back\n', `\n                {{ s('Back') }}\n`],
  ['\n                                        Trader\n', `\n                                        {{ s('Trader') }}\n`],
]

const singles = [
  'Behavioral Analytics',
  'Updating...',
  'Active Alerts',
  'Acknowledge',
  'Trading Personality Profiling',
  'No Trading Personality Profile Yet',
  'Confidence:',
  'Performance Score',
  'Scalper',
  'Momentum',
  'Mean Reversion',
  'Swing',
  'View trades',
  'Median Hold Time',
  'Per trade',
  'Trading Frequency',
  'Trades per day',
  'Position Consistency',
  'Sizing discipline',
  'Your Percentile',
  'Your Performance',
  'Top 10% Benchmark',
  'Elite performers',
  'peer avg',
  'Behavioral Drift Detection',
  'Drift Severity Levels',
  'Personality Shift',
  'Drift Score Explained',
  'Performance Impact',
  'Positive values',
  'negative values',
  'Hold Time Change',
  'Frequency Change',
  'Risk Tolerance Change',
  'Personalized Recommendations',
  'No trading personality analysis available yet.',
  'Analysis will run automatically when you have enough trade data.',
  'Revenge Trading Events',
  'Revenge Trading Loss Rate',
  'Avg Duration',
  'Total Losses Recovered',
  'Total Losses Increased',
  'Total Revenge P&L',
  'Revenge Trading Detection',
  'No Revenge Trading Detected',
  'Showing',
  'of',
  'revenge trading events',
  'Re-analyzing...',
  'Re-run Analysis',
  'Symbol:',
  'Entry:',
  'Exit:',
  'Loss:',
  'Completed:',
  'Side:',
  'Quantity:',
  'Time:',
  'Total Cost:',
  'Fees:',
  'Return:',
  'Losses recovered:',
  'Losses increased:',
  'Revenge trades:',
  'Previous',
  'Next',
  'Behavioral Insights',
  'Overall Risk Score',
  'Recommended Actions',
  'Risk Level Legend',
  'HIGH RISK',
  'MEDIUM RISK',
  'LOW RISK',
  'Understanding the Analytics',
  'Loss Aversion Analysis',
  'Missed Profit Opportunities',
  'Loss Aversion Behavior Analysis',
  'No loss aversion analysis available yet.',
  'Top Missed Profit Opportunities',
  'Updating analysis...',
  'Trades Analyzed',
  'Trades Exited Too Early',
  'Total Missed Profit',
  'Avg Missed %',
  'Overconfidence Indicators',
  'Overconfidence Events',
  'Recent Overconfidence Events',
  'Consecutive Wins → Overconfidence',
  'Baseline Size:',
  'Peak Size:',
  'What happened:',
  'Lucky break:',
  'Break even:',
  'No overconfidence analysis available yet.',
  'Behavioral Settings',
  'Monitor for revenge trading patterns',
  'Detection Sensitivity',
  'Cooling Period',
  'Recommended break time after losses',
  'Duration (minutes)',
  'Analyze Historical Trades',
  'Emotional Spillover',
  'Revenge Trading Response',
  'Revenge Trading Outcome',
  'vs',
  'Recommendation:',
  'Exit Quality Score:',
  'No missed opportunities analysis available yet.',
  'Estimated Monthly Cost:',
  'Missed Profit Potential:',
  'Extended Loss Costs:',
  'LOW (0-0.4):',
  'MEDIUM (0.4-0.7):',
  'HIGH (0.7-1.0):',
  'risky trading decisions',
  'the elevated confidence',
]

for (const [from, to] of pairs) {
  if (content.includes(from) && !content.includes(to.slice(0, Math.min(24, to.length)))) {
    content = content.split(from).join(to)
  }
}

const closeTags = 'h1|h2|h3|h4|h5|p|span|button|label|strong|dt|dd'
for (const text of singles.sort((a, b) => b.length - a.length)) {
  if (alreadyWrapped(text)) continue
  const flex = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  const re = new RegExp(`(>)\\s*${flex}\\s*(</(?:${closeTags})>)`, 'gi')
  content = content.replace(re, (m, open, close) => {
    if (m.includes("s('") || m.includes('s("') || m.includes('{{')) return m
    return `${open}${wrapText(text)}${close}`
  })
}

// Multiline headings (heading-card on own lines)
for (const text of singles) {
  if (alreadyWrapped(text)) continue
  const flex = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  const re = new RegExp(
    `(<h3 class="heading-card">)\\s*${flex}\\s*(</h3>)`,
    'gi'
  )
  content = content.replace(re, `$1\n                            ${wrapText(text)}\n                        $2`)
}

// Script notifications
const scriptReplacements = [
  ['showError("Error", "Failed to analyze historical trades")', 'showError(s("Error"), s("Failed to analyze historical trades"))'],
  ['showError("Error", "Failed to acknowledge alert")', 'showError(s("Error"), s("Failed to acknowledge alert"))'],
  ['showSuccess("Success", "Settings updated")', 'showSuccess(s("Success"), s("Settings updated"))'],
  ['showError("Error", "Failed to update settings")', 'showError(s("Error"), s("Failed to update settings"))'],
  ['showError("Error", "Failed to update sensitivity")', 'showError(s("Error"), s("Failed to update sensitivity"))'],
  ['showError("Error", "Failed to re-run analysis")', 'showError(s("Error"), s("Failed to re-run analysis"))'],
  ['showError("Error", "Failed to load trade details")', 'showError(s("Error"), s("Failed to load trade details"))'],
  ['showError("Error", "Failed to analyze loss aversion patterns")', 'showError(s("Error"), s("Failed to analyze loss aversion patterns"))'],
  ['showError("Error", "Failed to analyze overconfidence patterns")', 'showError(s("Error"), s("Failed to analyze overconfidence patterns"))'],
  ['showError("Error", "Failed to load top missed trades analysis")', 'showError(s("Error"), s("Failed to load top missed trades analysis"))'],
  ['showError("Error", "Failed to analyze trading personality")', 'showError(s("Error"), s("Failed to analyze trading personality"))'],
  ['showSuccess(\n            "Analysis Complete",', 'showSuccess(\n            s("Analysis Complete"),'],
  ['showSuccess(\n            "Updated",', 'showSuccess(\n            s("Updated"),'],
  ['if (!startTime || !endTime) return "Unknown";', 'if (!startTime || !endTime) return s("Unknown");'],
  ['return "N/A";', 'return s("N/A");'],
  ['return "< 1m";', 'return s("< 1m");'],
  ['title: "Loss Aversion Trades"', 'title: s("Loss Aversion Trades")'],
  ['name: "Scalper Trades"', 'name: s("Scalper Trades")'],
  ['name: "Momentum Trades"', 'name: s("Momentum Trades")'],
  ['name: "Mean Reversion Trades"', 'name: s("Mean Reversion Trades")'],
  ['name: "Swing Trades"', 'name: s("Swing Trades")'],
]
for (const [from, to] of scriptReplacements) {
  content = content.split(from).join(to)
}

content = content.replace(
  /`Analyzed historical trades\. Found \$\{response\.data\.patternsDetected \|\| 0\} revenge trading patterns\.`/g,
  "s('Analyzed historical trades. Found {count} revenge trading patterns.').replace('{count}', String(response.data.patternsDetected || 0))"
)
content = content.replace(
  /`Re-analyzed historical trades with new thresholds\. Found \$\{response\.data\.data\.revengeEventsCreated \|\| 0\} revenge trading events\.`/g,
  "s('Re-analyzed historical trades with new thresholds. Found {count} revenge trading events.').replace('{count}', String(response.data.data.revengeEventsCreated || 0))"
)

// formatDate locale
if (!content.includes('getDisplayLocale')) {
  content = content.replace(
    'const s = (text) => tSentence(text, { context: "metrics" });',
    `const s = (text) => tSentence(text, { context: "metrics" });
function getDisplayLocale() {
    return i18n.global.locale.value === "zh" ? "zh-CN" : "en-US";
}`
  )
  content = content.replace(
    'return new Date(dateString).toLocaleDateString("en-US", {',
    'return new Date(dateString).toLocaleDateString(getDisplayLocale(), {'
  )
}

fs.writeFileSync(filePath, content)
console.log('Done. Wrapped behavioral analytics strings.')
