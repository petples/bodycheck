<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

const router = useRouter()
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const sessionId = ref('')

// Initial greeting
const greeting = `你好呀！我係小健 🐱，一個關心你健康嘅 AI 朋友。

今日想同你傾下計，了解下你近排嘅身體狀況。唔使緊張，當傾計就得㗎啦！

首先想問下，你平時工作忙嗎？會唔會成日覺得攰？`

onMounted(() => {
  sessionId.value = localStorage.getItem('sessionId') || ''
  
  // Add initial greeting
  messages.value.push({
    id: '1',
    role: 'ai',
    content: greeting,
    timestamp: new Date()
  })
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  // Add user message
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })
  
  isLoading.value = true
  await scrollToBottom()
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId.value,
        message: userMessage
      })
    })
    
    const data = await response.json()
    
    // Add AI response
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: data.reply,
      timestamp: new Date()
    })
    
    // Check if assessment is complete
    if (data.isComplete) {
      setTimeout(() => {
        router.push('/result')
      }, 2000)
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: 'Sorry呀，我有啲嘢Load唔到...，不如你再講多次？',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const viewResult = () => {
  router.push('/result')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4 px-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🐱</span>
        <div>
          <h1 class="font-semibold text-gray-800">小健</h1>
          <p class="text-xs text-gray-500">中醫體質評估中</p>
        </div>
      </div>
      <button
        @click="viewResult"
        class="text-sm text-primary hover:underline"
      >
        睇結果 →
      </button>
    </header>

    <!-- Messages -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[80%] rounded-2xl px-4 py-3',
            msg.role === 'user' 
              ? 'bg-primary text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
          ]"
        >
          <p class="whitespace-pre-wrap">{{ msg.content }}</p>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="bg-white border-t p-4">
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="講低你嘅情況..."
          class="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-primary"
          :disabled="isLoading"
        />
        <button
          type="submit"
          :disabled="!inputMessage.trim() || isLoading"
          class="bg-primary text-white rounded-full px-6 py-3 font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          发送
        </button>
      </form>
    </div>
  </div>
</template>