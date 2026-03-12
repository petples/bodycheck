import express from 'express'
import { sessions } from '../index.js'
import { generateAIResponse, extractDataFromResponse } from '../services/ai.js'
import { calculateProgress } from '../services/scoring.js'

export const chatRouter = express.Router()

chatRouter.post('/', async (req, res) => {
  try {
    const { sessionId, message } = req.body
    
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' })
    }
    
    const session = sessions.get(sessionId)
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    // Add user message to history
    session.messages.push({ role: 'user', content: message })
    
    // Generate AI response
    const aiReply = await generateAIResponse(session.messages, session.extractedData)
    
    // Extract data from AI response
    const extracted = extractDataFromResponse(aiReply)
    Object.assign(session.extractedData, extracted)
    
    // Update progress
    session.progress = calculateProgress(session.extractedData)
    
    // Check if complete (need at least 20 data points)
    session.isComplete = Object.keys(session.extractedData).length >= 20
    
    // Add AI response to history
    session.messages.push({ role: 'assistant', content: aiReply.reply })
    session.coveredTopics.push(...aiReply.coveredTopics || [])
    
    session.updatedAt = new Date()
    
    res.json({
      reply: aiReply.reply,
      extracted,
      progress: session.progress,
      isComplete: session.isComplete
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})