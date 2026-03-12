// AI Service - handles conversation with OpenAI/Claude

// System prompt for the AI assistant
const SYSTEM_PROMPT = `你是一位關心用家健康的中醫體質評估助手「小健」。

你的任務：
1. 以輕鬆聊天的方式了解用家的身體狀況
2. 從對話中自然地收集體質評估所需的資訊
3. 對用家的分享給予共情和鼓勵

對話風格：
- 像朋友一樣親切、溫暖
- 使用廣東話（繁體中文）
- 適當使用 emoji 增加親和力
- 不生硬地問問題，而是從話題自然延伸

你已經收集到的資訊：
{extractedData}

你需要了解的資訊類別（根據用家回答自然引導）：
1. 精力與疲勞程度 (energy) - Q2, Q6, Q7
2. 呼吸與心血管狀況 (breathing) - Q3, Q4
3. 情緒與心理狀態 (emotion) - Q9, Q10, Q11, Q12, Q13
4. 怕冷或怕熱的情況 (temperature) - Q17, Q18, Q19, Q20, Q21, Q22
5. 過敏與免疫力 (allergy) - Q23, Q24, Q25, Q26, Q30, Q31, Q32
6. 皮膚與外觀 (skin) - Q34, Q38, Q39, Q48, Q49
7. 消化與排泄 (digestion) - Q28, Q29, Q42, Q46, Q50, Q51, Q57, Q58
8. 睡眠品質 (sleep) - Q14, Q15, Q16

評分標準（從用家回答推斷）：
- 經常/明顯 = 5分
- 有時/幾次 = 3分
- 很少/從不 = 1分

當收集到足夠資訊（覆蓋至少6個類別，每個類別至少2題）後，可以禮貌地告知用家可以查看結果。

重要：在你的回覆結尾，必須以以下 JSON 格式輸出你從用家回答中提取的資訊（如果有的話）：
{{"extracted": {{"Q題目號碼": 分數}}, "topics": ["已覆蓋話題"]}}

例如：{{"extracted": {{"Q2": 5, "Q3": 3}}, "topics": ["energy", "breathing"]}}`

interface ExtractedData {
  [key: string]: number
}

interface TopicCoverage {
  [key: string]: number
}

const TOPIC_QUESTIONS: Record<string, number[]> = {
  energy: [2, 6, 7],
  breathing: [3, 4],
  emotion: [9, 10, 11, 12, 13],
  temperature: [17, 18, 19, 20, 21, 22],
  allergy: [23, 24, 25, 26, 30, 31, 32],
  skin: [34, 38, 39, 48, 49],
  digestion: [28, 29, 42, 46, 50, 51, 57, 58],
  sleep: [14, 15, 16]
}

const FALLBACK_REPLIES = [
  "明白呀，你講啲情況對我好有幫助。你平時係咁㗎啦？",
  "咁呀...你試過有啲咩唔舒服或者特別既情況嗎？",
  "我聽日緊你既情況啦。不如你講多啲關於呢方面既野？"
]

// Mock AI response for development (no API key needed)
function generateFallbackResponse(messages: any[], extracted: ExtractedData): string {
  const lastMessage = messages[messages.length - 1]?.content || ''
  
  // Simple keyword-based responses
  if (lastMessage.includes('攰') || lastMessage.includes('累') || lastMessage.includes('疲倦')) {
    return `辛苦曬你啦 💪 咁你攰既時候，係早啲瞓定係都會撐到好夜？`
  }
  
  if (lastMessage.includes('夜') || lastMessage.includes('遲') || lastMessage.includes('晏')) {
    return `咁你有冇試過因為咁而訓唔好？或者訓醒之後都唔夠休息既感覺？`
  }
  
  if (lastMessage.includes('訓') || lastMessage.includes('瞓') || lastMessage.includes('訓晤好')) {
    return `訓晤好真係好辛苦架 😟 你通常訓幾多个鐘？會唔會發夢多或者容易扎醒？`
  }
  
  if (lastMessage.includes('壓力') || lastMessage.includes('緊張') || lastMessage.includes('擔心')) {
    return `依家有幾多人有壓力架，你都唔容易仔 ✨ 咁你平時用咩方法舒緩㗎？`
  }
  
  if (lastMessage.includes('凍') || lastMessage.includes('冷') || lastMessage.includes('怕凍')) {
    return `怕凍既話，係咪手腳成日都冰冷？定係只係、天氣凍既時候先？`
  }
  
  if (lastMessage.includes('熱') || lastMessage.includes('焗') || lastMessage.includes('怕熱')) {
    return `怕熱既話，你會唔會成日出汗？或者覺得個人就好似焗住咁？`
  }
  
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
}

export async function generateAIResponse(
  messages: any[],
  extracted: ExtractedData
): Promise<{ reply: string; coveredTopics: string[] }> {
  
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    // Use fallback response
    const reply = generateFallbackResponse(messages, extracted)
    return { 
      reply, 
      coveredTopics: Object.keys(TOPIC_QUESTIONS).slice(0, 2) 
    }
  }
  
  try {
    // Try to use OpenAI
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey })
    
    const context = messages.slice(-6).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))
    
    const prompt = SYSTEM_PROMPT.replace(
      '{extractedData}',
      JSON.stringify(extracted, null, 2)
    )
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        ...context
      ],
      temperature: 0.7,
      max_tokens: 500
    })
    
    const reply = response.choices[0]?.message?.content || 'Sorry，我有啲嘢 Load 唔到...'
    
    return { 
      reply, 
      coveredTopics: Object.keys(TOPIC_QUESTIONS).slice(0, 2)
    }
  } catch (error) {
    console.error('OpenAI error:', error)
    // Fallback on error
    return { 
      reply: generateFallbackResponse(messages, extracted), 
      coveredTopics: []
    }
  }
}

export function extractDataFromResponse(aiResponse: any): ExtractedData {
  // This would parse the JSON from the AI response
  // For now, return empty - actual parsing would happen in production
  return {}
}

export function getTopicCoverage(extracted: ExtractedData): TopicCoverage {
  const coverage: TopicCoverage = {}
  
  for (const [topic, questions] of Object.entries(TOPIC_QUESTIONS)) {
    const answered = questions.filter(q => extracted[`Q${q}`] !== undefined)
    coverage[topic] = answered.length
  }
  
  return coverage
}