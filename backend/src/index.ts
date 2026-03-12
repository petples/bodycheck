import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { chatRouter } from './routes/chat.js'
import { resultRouter } from './routes/result.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/chat', chatRouter)
app.use('/api/result', resultRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Create session endpoint
import { v4 as uuidv4 } from 'uuid'

// In-memory session storage (use Redis in production)
export const sessions = new Map()

app.post('/api/session', (req, res) => {
  const sessionId = uuidv4()
  sessions.set(sessionId, {
    id: sessionId,
    messages: [],
    extractedData: {},
    coveredTopics: [],
    progress: 0,
    isComplete: false,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  res.json({ sessionId })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})