import express from 'express'
import { sessions } from '../index.js'
import { calculateResult } from '../services/scoring.js'

export const resultRouter = express.Router()

resultRouter.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    
    const session = sessions.get(sessionId)
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    const result = calculateResult(session.extractedData)
    
    res.json(result)
  } catch (error) {
    console.error('Result error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})