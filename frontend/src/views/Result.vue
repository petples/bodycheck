<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, RadarChart, TitleComponent, TooltipComponent, LegendComponent])

const sessionId = ref('')
const isLoading = ref(true)
const primaryType = ref('')
const bodyTypes = ref<any[]>([])
const radarData = ref<number[]>([])

const bodyTypeColors: Record<string, string> = {
  '平和質': '#4CAF50',
  '氣虛質': '#FF9800',
  '陽虛質': '#2196F3',
  '陰虛質': '#9C27B0',
  '痰濕質': '#795548',
  '濕熱質': '#F44336',
  '血瘀質': '#E91E63',
  '氣鬱質': '#607D8B',
  '特禀質': '#00BCD4'
}

// Radar chart option
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  radar: {
    indicator: [
      { name: '平和', max: 100 },
      { name: '氣虛', max: 100 },
      { name: '陽虛', max: 100 },
      { name: '陰虛', max: 100 },
      { name: '痰濕', max: 100 },
      { name: '濕熱', max: 100 },
      { name: '血瘀', max: 100 },
      { name: '氣鬱', max: 100 },
      { name: '特禀', max: 100 }
    ],
    radius: '65%',
    splitNumber: 4,
    axisName: {
      color: '#666',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0,0,0,0.1)'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(74,144,164,0.02)', 'rgba(74,144,164,0.04)', 'rgba(74,144,164,0.06)', 'rgba(74,144,164,0.08)']
      }
    }
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: radarData.value,
          name: '體質分數',
          areaStyle: {
            color: 'rgba(74,144,164,0.3)'
          },
          lineStyle: {
            color: '#4A90A4',
            width: 2
          },
          itemStyle: {
            color: '#4A90A4'
          }
        }
      ]
    }
  ]
}))

onMounted(async () => {
  sessionId.value = localStorage.getItem('sessionId') || ''
  
  try {
    const response = await fetch(`/api/result/${sessionId.value}`)
    const data = await response.json()
    
    primaryType.value = data.primaryType
    bodyTypes.value = data.bodyTypes
    radarData.value = data.radarData
  } catch (error) {
    console.error('Failed to load result:', error)
    // Demo data for testing
    primaryType.value = '氣虛質'
    bodyTypes.value = [
      { name: '平和質', score: 65, level: '有傾向', description: '你既身體狀況大致健康...' },
      { name: '氣虛質', score: 72, level: '明顯', description: '你既氣虛表現比較明顯...' },
      { name: '陽虛質', score: 45, level: '有傾向', description: '你既陽虛表現不太明顯...' }
    ]
    radarData.value = [65, 72, 45, 38, 42, 35, 28, 52, 30]
  } finally {
    isLoading.value = false
  }
})

const getTypeColor = (name: string) => {
  return bodyTypeColors[name] || '#4A90A4'
}

const getLevelClass = (level: string) => {
  switch (level) {
    case '明顯': return 'bg-red-100 text-red-700'
    case '有傾向': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-green-100 text-green-700'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">📊</div>
        <h1 class="text-2xl font-bold text-gray-800">體質評估結果</h1>
        <p v-if="primaryType" class="text-lg text-primary mt-2">
          你既主體質：<strong>{{ primaryType }}</strong>
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin text-4xl">⏳</div>
        <p class="text-gray-500 mt-4">緊係Load緊...</p>
      </div>

      <div v-else>
        <!-- Radar Chart -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 text-center">體質分佈</h2>
          <v-chart class="h-80" :option="chartOption" autoresize />
        </div>

        <!-- Body Type Cards -->
        <div class="space-y-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-800">詳細分析</h2>
          
          <div
            v-for="type in bodyTypes"
            :key="type.name"
            class="bg-white rounded-xl shadow-sm p-4 border-l-4"
            :style="{ borderLeftColor: getTypeColor(type.name) }"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-800">{{ type.name }}</h3>
              <span 
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="getLevelClass(type.level)"
              >
                {{ type.level }}
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                class="h-2 rounded-full transition-all"
                :style="{ 
                  width: type.score + '%',
                  backgroundColor: getTypeColor(type.name)
                }"
              ></div>
            </div>
            <p class="text-sm text-gray-600">{{ type.description }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            @click="$router.push('/')"
            class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            重新測試
          </button>
          <button
            class="flex-1 bg-primary text-white py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
          >
            分享結果
          </button>
        </div>
      </div>
    </div>
  </div>
</template>