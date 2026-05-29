<template>
  <div class="card">
    <div class="card-body">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ s('Health-Trading Correlations') }}
        </h3>
        <div class="flex items-center space-x-2">
          <select
            v-model="selectedMetric"
            @change="updateChart"
            class="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
          >
            <option value="heart_rate">{{ s('Heart Rate') }}</option>
            <option value="sleep_score">{{ s('Sleep Quality') }}</option>
            <option value="sleep_hours">{{ s('Sleep Hours') }}</option>
            <option value="stress_level">{{ s('Stress Level') }}</option>
          </select>
          <select
            v-model="selectedPeriod"
            @change="loadCorrelationData"
            class="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2"
          >
            <option value="7">{{ s('Last 7 Days') }}</option>
            <option value="30">{{ s('Last 30 Days') }}</option>
            <option value="90">{{ s('Last 90 Days') }}</option>
            <option value="all">{{ s('All Time') }}</option>
          </select>
          <label class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              v-model="removeOutliers"
              @change="updateChart"
              class="mr-2 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
            />
            {{ s('Remove Outliers') }}
          </label>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="correlationData.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ s('No health data available for correlation analysis') }}
        </p>
      </div>

      <div v-else>
        <div class="mb-6">
          <canvas ref="scatterChart" height="300"></canvas>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ s('Correlation Coefficient') }}</div>
            <div class="text-xl font-semibold" :class="getCorrelationClass(statistics.correlation)">
              {{ statistics.correlation.toFixed(3) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ getCorrelationStrength(statistics.correlation) }}
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ s('Average P&L Impact') }}</div>
            <div class="text-xl font-semibold" :class="statistics.avgImpact >= 0 ? 'text-green-600' : 'text-red-600'">
              ${{ Math.abs(statistics.avgImpact).toFixed(2) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ s('Per {unit}').replace('{unit}', getMetricUnit(selectedMetric)) }}
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ s('Win Rate Impact') }}</div>
            <div class="text-xl font-semibold" :class="statistics.winRateImpact >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ statistics.winRateImpact > 0 ? '+' : '' }}{{ statistics.winRateImpact.toFixed(1) }}%
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ s('When {condition}').replace('{condition}', getMetricCondition(selectedMetric)) }}
            </div>
          </div>
        </div>

        <div v-if="insights.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ s('Key Insights') }}</h4>
          <div v-for="(insight, index) in insights" :key="index"
               class="p-3 rounded-lg border"
               :class="getInsightClass(insight.type)">
            <div class="flex items-start">
              <svg class="h-5 w-5 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="insight.type === 'positive'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                <path v-else-if="insight.type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <p class="text-sm">{{ insight.message }}</p>
                <p v-if="insight.recommendation" class="text-xs mt-1 opacity-75">
                  <svg class="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" />
                  </svg>
                  {{ insight.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Chart, registerables } from 'chart.js'
import { tSentence } from '@/i18n'
import api from '@/services/api'

Chart.register(...registerables)

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })

defineProps({
  userId: String
})

const loading = ref(false)
const selectedMetric = ref('heart_rate')
const selectedPeriod = ref('30')
const removeOutliers = ref(false)
const correlationData = ref([])
const scatterChart = ref(null)
let chartInstance = null

const statistics = ref({
  correlation: 0,
  avgImpact: 0,
  winRateImpact: 0
})

const insights = ref([])

function getTradeHealthValue(trade, field) {
  const aliases = {
    heart_rate: ['heart_rate', 'heartRate'],
    sleep_score: ['sleep_score', 'sleepScore'],
    sleep_hours: ['sleep_hours', 'sleepHours'],
    stress_level: ['stress_level', 'stressLevel']
  }

  for (const key of aliases[field] || [field]) {
    if (trade[key] !== null && trade[key] !== undefined) {
      return trade[key]
    }
  }

  return null
}

async function loadCorrelationData() {
  loading.value = true
  try {
    const endDate = new Date()
    const params = {
      endDate: endDate.toISOString().split('T')[0],
      limit: 1000
    }

    if (selectedPeriod.value !== 'all') {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod.value))
      params.startDate = startDate.toISOString().split('T')[0]
    }

    const response = await api.get('/trades', { params })

    const tradesWithHealth = response.data.trades.filter(trade => {
      return getTradeHealthValue(trade, selectedMetric.value) !== null
    })

    correlationData.value = tradesWithHealth.map(trade => ({
      date: trade.trade_date,
      pnl: trade.pnl,
      winRate: trade.pnl > 0 ? 1 : 0,
      heart_rate: getTradeHealthValue(trade, 'heart_rate'),
      sleep_score: getTradeHealthValue(trade, 'sleep_score'),
      sleep_hours: getTradeHealthValue(trade, 'sleep_hours'),
      stress_level: getTradeHealthValue(trade, 'stress_level'),
      symbol: trade.symbol,
      side: trade.side
    }))
  } catch (error) {
    console.error('Error loading correlation data:', error)
  } finally {
    loading.value = false
    calculateStatistics()
    generateInsights()
    await nextTick()
    updateChart()
  }
}

function calculateStatistics() {
  if (correlationData.value.length < 2) {
    statistics.value = { correlation: 0, avgImpact: 0, winRateImpact: 0 }
    return
  }

  const metric = selectedMetric.value
  const validData = correlationData.value.filter(d =>
    d[metric] !== null && d[metric] !== undefined && !isNaN(d[metric]) &&
    d.pnl !== null && d.pnl !== undefined && !isNaN(parseFloat(d.pnl))
  )

  if (validData.length < 2) {
    statistics.value = { correlation: 0, avgImpact: 0, winRateImpact: 0 }
    return
  }

  const values = validData.map(d => parseFloat(d[metric]))
  const pnls = validData.map(d => parseFloat(d.pnl))

  const n = values.length
  const sumX = values.reduce((a, b) => a + b, 0)
  const sumY = pnls.reduce((a, b) => a + b, 0)
  const sumXY = values.reduce((total, x, i) => total + x * pnls[i], 0)
  const sumX2 = values.reduce((total, x) => total + x * x, 0)
  const sumY2 = pnls.reduce((total, y) => total + y * y, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  const correlation = numerator / denominator

  statistics.value.correlation = isNaN(correlation) ? 0 : correlation

  const avgMetric = sumX / n
  const highMetric = validData.filter(d => parseFloat(d[metric]) > avgMetric)
  const lowMetric = validData.filter(d => parseFloat(d[metric]) <= avgMetric)

  const avgHighPnL = highMetric.length > 0 ?
    highMetric.reduce((sum, d) => sum + parseFloat(d.pnl), 0) / highMetric.length : 0
  const avgLowPnL = lowMetric.length > 0 ?
    lowMetric.reduce((sum, d) => sum + parseFloat(d.pnl), 0) / lowMetric.length : 0

  statistics.value.avgImpact = avgHighPnL - avgLowPnL

  const highWinRate = highMetric.length > 0 ?
    (highMetric.filter(d => parseFloat(d.pnl) > 0).length / highMetric.length) * 100 : 0
  const lowWinRate = lowMetric.length > 0 ?
    (lowMetric.filter(d => parseFloat(d.pnl) > 0).length / lowMetric.length) * 100 : 0

  statistics.value.winRateImpact = highWinRate - lowWinRate
}

function generateInsights() {
  insights.value = []
  const metric = selectedMetric.value
  const correlation = statistics.value.correlation
  const metricLabel = getMetricLabel(metric)

  if (Math.abs(correlation) > 0.5) {
    const direction = correlation > 0 ? s('positive') : s('negative')
    insights.value.push({
      type: correlation > 0 ? 'positive' : 'warning',
      message: s('Strong {direction} correlation detected between {metric} and trading performance')
        .replace('{direction}', direction)
        .replace('{metric}', metricLabel),
      recommendation: correlation > 0 ?
        s('Maintain healthy {metric} levels for better trading outcomes').replace('{metric}', metricLabel) :
        s('Monitor {metric} levels as they may negatively impact your trading').replace('{metric}', metricLabel)
    })
  }

  if (metric === 'sleep_hours') {
    const avgSleep = correlationData.value.reduce((sum, d) => sum + d.sleep_hours, 0) / correlationData.value.length
    if (avgSleep < 6) {
      insights.value.push({
        type: 'warning',
        message: s('Your average sleep duration is below recommended levels'),
        recommendation: s('Aim for 7-9 hours of sleep for optimal trading performance')
      })
    }
  }

  if (metric === 'heart_rate') {
    const highHR = correlationData.value.filter(d => d.heart_rate > 85)
    if (highHR.length > correlationData.value.length * 0.3) {
      insights.value.push({
        type: 'warning',
        message: s('Elevated heart rate detected in over 30% of trades'),
        recommendation: s('Consider stress management techniques before trading')
      })
    }
  }

  if (Math.abs(statistics.value.winRateImpact) > 10) {
    const condition = getMetricCondition(metric)
    const impact = Math.abs(statistics.value.winRateImpact).toFixed(1)
    const messageKey = statistics.value.winRateImpact > 0
      ? '{condition} shows {impact}% higher win rate'
      : '{condition} shows {impact}% lower win rate'
    insights.value.push({
      type: statistics.value.winRateImpact > 0 ? 'positive' : 'warning',
      message: s(messageKey).replace('{condition}', condition).replace('{impact}', impact),
      recommendation: statistics.value.winRateImpact > 0 ?
        s('Continue maintaining good {metric} habits').replace('{metric}', metricLabel) :
        s('Improve {metric} to potentially increase win rate').replace('{metric}', metricLabel)
    })
  }
}

function removeOutliersFromData(data) {
  if (data.length < 4) return data

  const pnlValues = data.map(d => d.y).sort((a, b) => a - b)
  const q1Index = Math.floor(pnlValues.length * 0.25)
  const q3Index = Math.floor(pnlValues.length * 0.75)
  const q1 = pnlValues[q1Index]
  const q3 = pnlValues[q3Index]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  return data.filter(d => d.y >= lowerBound && d.y <= upperBound)
}

function updateChart() {
  if (!scatterChart.value) return

  const ctx = scatterChart.value.getContext('2d')

  if (chartInstance) {
    chartInstance.destroy()
  }

  const metric = selectedMetric.value
  const validData = correlationData.value.filter(d =>
    d[metric] !== null && d[metric] !== undefined && !isNaN(d[metric])
  )

  let data = validData.map(d => ({
    x: parseFloat(d[metric]),
    y: parseFloat(d.pnl)
  }))

  if (removeOutliers.value) {
    data = removeOutliersFromData(data)
  }

  const metricLabel = getMetricLabel(metric)
  const metricUnit = getMetricUnit(metric)

  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: s('Trades'),
        data: data,
        backgroundColor: data.map(d => d.y >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'),
        borderColor: data.map(d => d.y >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return [
                s('{metric}: {value} {unit}')
                  .replace('{metric}', metricLabel)
                  .replace('{value}', context.parsed.x.toFixed(1))
                  .replace('{unit}', metricUnit),
                s('P&L: ${value}').replace('{value}', context.parsed.y.toFixed(2))
              ]
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: `${metricLabel} (${metricUnit})`
          }
        },
        y: {
          title: {
            display: true,
            text: s('P&L ($)')
          }
        }
      }
    }
  })
}

function getMetricLabel(metric) {
  const labels = {
    heart_rate: s('Heart Rate'),
    sleep_score: s('Sleep Quality'),
    sleep_hours: s('Sleep Duration'),
    stress_level: s('Stress Level')
  }
  return labels[metric] || metric
}

function getMetricUnit(metric) {
  const units = {
    heart_rate: s('BPM'),
    sleep_score: s('Score'),
    sleep_hours: s('Hours'),
    stress_level: '%'
  }
  return units[metric] || ''
}

function getMetricCondition(metric) {
  const conditions = {
    heart_rate: s('Higher heart rate'),
    sleep_score: s('Better sleep quality'),
    sleep_hours: s('More sleep'),
    stress_level: s('Higher stress')
  }
  return conditions[metric] || s('Higher values')
}

function getCorrelationClass(correlation) {
  const abs = Math.abs(correlation)
  if (abs > 0.7) return correlation > 0 ? 'text-green-600' : 'text-red-600'
  if (abs > 0.4) return correlation > 0 ? 'text-green-500' : 'text-orange-500'
  return 'text-gray-600'
}

function getCorrelationStrength(correlation) {
  const abs = Math.abs(correlation)
  if (abs > 0.7) return s('Strong correlation')
  if (abs > 0.4) return s('Moderate correlation')
  if (abs > 0.2) return s('Weak correlation')
  return s('No correlation')
}

function getInsightClass(type) {
  const classes = {
    positive: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
  }
  return classes[type] || classes.info
}

onMounted(async () => {
  await nextTick()
  loadCorrelationData()
})

watch(selectedMetric, () => {
  calculateStatistics()
  generateInsights()
  updateChart()
})

watch(locale, () => {
  generateInsights()
  updateChart()
})
</script>
