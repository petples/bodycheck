<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isStarting = ref(false)

const startChat = async () => {
  isStarting.value = true
  try {
    // Create session
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    
    // Store session ID and go to chat
    localStorage.setItem('sessionId', data.sessionId)
    router.push('/chat')
  } catch (error) {
    console.error('Failed to start:', error)
    // Fallback: just go to chat
    router.push('/chat')
  } finally {
    isStarting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4">
    <!-- Logo / Title -->
    <div class="text-center mb-12">
      <div class="text-6xl mb-4">🐱</div>
      <h1 class="text-4xl font-bold text-gray-800 mb-2">BodyCheck</h1>
      <p class="text-lg text-gray-600">中醫體質測試</p>
    </div>

    <!-- Intro Card -->
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">你好！我係小健 🐱</h2>
      <p class="text-gray-600 mb-4">
        今日想同你傾下計，了解下你近排嘅身體狀況。
      </p>
      <p class="text-gray-600 mb-4">
        唔使緊張，當朋友傾計就得。我會問你一啲生活上嘅小事，你照實答就得㗎喇！
      </p>
      <div class="bg-green-50 rounded-lg p-4 text-sm text-green-700">
        💡 大約 5-10 分鐘，用輕鬆聊天嘅方式完成評估
      </div>
    </div>

    <!-- Start Button -->
    <button
      @click="startChat"
      :disabled="isStarting"
      class="bg-primary hover:bg-opacity-90 text-white font-semibold py-4 px-12 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isStarting">緊係...</span>
      <span v-else>開始傾計啦！</span>
    </button>

    <!-- Footer -->
    <p class="mt-8 text-sm text-gray-400">
      完全免費 · 隱私保護 · 結果即時
    </p>
  </div>
</template>