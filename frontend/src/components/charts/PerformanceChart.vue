<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { tSentence, i18n } from '@/i18n'

Chart.register(...registerables)

const { locale } = useI18n()
const s = (text) => tSentence(text, { context: 'metrics' })

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  rValueMode: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null)
let chart = null

const dateFnsLocale = computed(() => (i18n.global.locale.value === 'zh' ? zhCN : enUS))

const dailyLabel = computed(() => {
  void locale.value
  return props.rValueMode ? s('Daily R-Multiple') : s('Daily P&L')
})

const cumulativeLabel = computed(() => {
  void locale.value
  return props.rValueMode ? s('Cumulative R-Multiple') : s('Cumulative P&L')
})

function createChart() {
  if (chart) {
    chart.destroy()
  }

  if (!chartCanvas.value || props.data.length === 0) return

  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#E5E7EB' : '#374151'
  const gridColor = isDark ? '#374151' : '#E5E7EB'

  const ctx = chartCanvas.value.getContext('2d')

  const labels = props.data.map(d => format(new Date(d.period), 'MMM dd', { locale: dateFnsLocale.value }))

  const dailyData = props.rValueMode
    ? props.data.map(d => d.r_value || 0)
    : props.data.map(d => d.pnl)

  const cumulativeData = props.rValueMode
    ? props.data.map(d => d.cumulative_r_value || 0)
    : props.data.map(d => d.cumulative_pnl)

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: dailyLabel.value,
          data: dailyData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: cumulativeLabel.value,
          data: cumulativeData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColor
          },
          grid: {
            color: gridColor
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColor
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  })
}

onMounted(() => {
  if (props.data.length > 0) {
    createChart()
  }
})

watch(() => props.data, () => {
  if (props.data.length > 0) {
    createChart()
  }
}, { deep: true })

watch(() => props.rValueMode, () => {
  if (props.data.length > 0) {
    createChart()
  }
})

watch(locale, () => {
  if (props.data.length > 0) {
    createChart()
  }
})

watch(() => document.documentElement.classList.contains('dark'), () => {
  if (props.data.length > 0) {
    createChart()
  }
})
</script>

<style scoped>
div {
  position: relative;
}

canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
