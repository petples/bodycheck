// Scoring Service - calculates body constitution results

interface ExtractedData {
  [key: string]: number
}

interface BodyTypeResult {
  name: string
  nameEn: string
  score: number
  level: '明顯' | '有傾向' | '不明顯'
  description: string
  suggestions: string[]
}

interface AssessmentResult {
  sessionId: string
  primaryType: string
  primaryTypeEn: string
  bodyTypes: BodyTypeResult[]
  radarData: number[]
  createdAt: Date
}

// 9 body types with their question mappings
const BODY_TYPES = {
  pinghe: { name: '平和質', nameEn: 'Balanced', questions: [1, 53] },
  qixu: { name: '氣虛質', nameEn: 'Qi Deficiency', questions: [2, 3, 4, 5, 6, 7] },
  yangxu: { name: '陽虛質', nameEn: 'Yang Deficiency', questions: [18, 19, 20, 22, 52, 55] },
  yinxu: { name: '陰虛質', nameEn: 'Yin Deficiency', questions: [17, 21, 29, 46, 57] },
  tanshi: { name: '痰濕質', nameEn: 'Phlegm-Damp', questions: [28, 39, 42, 50, 51, 58] },
  shire: { name: '濕熱質', nameEn: 'Damp-Heat', questions: [38, 48, 49, 59, 60] },
  xueyu: { name: '血瘀質', nameEn: 'Blood Stasis', questions: [33, 37, 40, 43, 45] },
  qiyu: { name: '氣鬱質', nameEn: 'Qi Stagnation', questions: [9, 10, 11, 12, 13, 15, 47, 54] },
  tebing: { name: '特禀質', nameEn: 'Special Constitution', questions: [23, 24, 25, 26, 30, 31, 32, 34] }
}

// Descriptions for each body type
const TYPE_DESCRIPTIONS: Record<string, { desc: string; suggestions: string[] }> = {
  pinghe: {
    desc: '你既身體狀況大致健康，屬於平和體質！呢種體質既人通常精力充沛、适应力強，係難得既健康狀態。記得继续保持良好既生活同飲食習慣！',
    suggestions: [
      '保持規律既作息時間',
      '均衡飲食，唔好偏食',
      '適當運動，保持活力'
    ]
  },
  qixu: {
    desc: '你既氣虛表現比較明顯。氣虛既人容易覺得疲乏、氣短，講野既時候聲音可能比較低弱。你可能會覺得自己成日都好攰，就算訓醒都唔夠精神。',
    suggestions: [
      '多啲休息，避免過度疲勞',
      '食啲補氣既食物，如紅棗、淮山',
      '適度運動，但唔好做太劇烈既運動'
    ]
  },
  yangxu: {
    desc: '你既陽虛表現比較明顯。陽虛既人通常怕凍、手腳容易冰冷，特別係秋冬既時候。你可能會比較鐘意食熱既野，唔鐘意凍既食物。',
    suggestions: [
      '注意保暖，特別係頸同腳',
      '可以食啲溫陽既食物，如生薑、羊肉',
      '多啲曬太陽，做啲溫和既運動'
    ]
  },
  yinxu: {
    desc: '你既陰虛表現比較明顯。陰虛既人通常手腳心熱、口乾喉嚨乾，可能會有便秘既情況。你可能會覺得自己成日都好「熱氣」，鐘意飲凍野。',
    suggestions: [
      '多啲飲水，補充水分',
      '避免食太多辛辣、油炸既野',
      '食啲滋陰既食物，如雪梨、蜂蜜'
    ]
  },
  tanshi: {
    desc: '你既痰濕表現比較明顯。痰濕既人通常體型較為肥滿，腹部脹滿，多汗同埋成日覺得胸悶。你既身體可能比較容易積聚水分。',
    suggestions: [
      '少食油膩、甜既野',
      '適度運動出汗',
      '可以飲啲祛濕既湯水，如冬瓜湯'
    ]
  },
  shire: {
    desc: '你既濕熱表現比較明顯。濕熱既人通常面部油光、容易口苦、小便偏黃。你可能會覺得自己成日都好「熱氣」，脾氣都可能會比較躁。',
    suggestions: [
      '避免食辛辣、油炸既野',
      '多啲飲清熱既野，如涼茶',
      '保持皮膚清潔'
    ]
  },
  xueyu: {
    desc: '你既血瘀表現比較明顯。血瘀既人通常面色較為晦暗，皮膚容易出現瘀青，偶然會有疼痛既情況。你既血液循環可能不太好。',
    suggestions: [
      '保持適度運動促進血液循環',
      '可以食啲活血既食物，如黑木耳',
      '注意保暖'
    ]
  },
  qiyu: {
    desc: '你既氣鬱表現比較明顯。氣鬱既人通常情緒較為低落、容易緊張、鍾意歎氣。你可能會覺得自己既情緒比較大起伏，或者、成日都好擔心。',
    suggestions: [
      '搵啱自己既舒壓方法',
      '多啲同朋友傾計',
      '可以試下瑜伽或者冥想'
    ]
  },
  tebing: {
    desc: '你既特禀表現比較明顯。特禀既人通常有過敏既情況，例如鼻敏感、皮膚敏感等。你既身體對某啲野可能會特別敏感。',
    suggestions: [
      '避免接觸已知既致敏原',
      '保持家居清潔',
      '睇醫生了解和管理過敏情況'
    ]
  }
}

// Radar chart order (must match 9 types)
const RADAR_ORDER = ['pinghe', 'qixu', 'yangxu', 'yinxu', 'tanshi', 'shire', 'xueyu', 'qiyu', 'tebing']

export function calculateProgress(extracted: ExtractedData): number {
  // Max possible: 60 questions * 5 points = 300
  const totalPoints = Object.values(extracted).reduce((sum, val) => sum + val, 0)
  const maxPoints = 60 * 5
  
  return Math.round((totalPoints / maxPoints) * 100)
}

export function calculateResult(extracted: ExtractedData): AssessmentResult {
  const results: { key: string; score: number }[] = []
  
  // Calculate score for each body type
  for (const [key, type] of Object.entries(BODY_TYPES)) {
    const answeredQuestions = type.questions.filter(q => extracted[`Q${q}`] !== undefined)
    
    if (answeredQuestions.length === 0) {
      results.push({ key, score: 0 })
      continue
    }
    
    const totalScore = answeredQuestions.reduce((sum, q) => sum + (extracted[`Q${q}`] || 0), 0)
    const maxScore = answeredQuestions.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)
    
    results.push({ key, score: percentage })
  }
  
  // Determine level for each type
  const bodyTypes: BodyTypeResult[] = results.map(r => {
    let level: '明顯' | '有傾向' | '不明顯'
    if (r.score >= 60) level = '明顯'
    else if (r.score >= 40) level = '有傾向'
    else level = '不明顯'
    
    const typeInfo = BODY_TYPES[r.key as keyof typeof BODY_TYPES]
    const descInfo = TYPE_DESCRIPTIONS[r.key]
    
    return {
      name: typeInfo.name,
      nameEn: typeInfo.nameEn,
      score: r.score,
      level,
      description: descInfo?.desc || '',
      suggestions: descInfo?.suggestions || []
    }
  })
  
  // Sort by score descending
  bodyTypes.sort((a, b) => b.score - a.score)
  
  // Get primary type (highest score that's not pinghe unless it's the only high one)
  const nonPinghe = bodyTypes.filter(t => t.name !== '平和質')
  const primaryType = nonPinghe.length > 0 && nonPinghe[0].score >= 40 
    ? nonPinghe[0] 
    : bodyTypes[0]
  
  // Build radar data in correct order
  const radarData = RADAR_ORDER.map(key => {
    const found = results.find(r => r.key === key)
    return found?.score || 0
  })
  
  return {
    sessionId: '',
    primaryType: primaryType.name,
    primaryTypeEn: primaryType.nameEn,
    bodyTypes,
    radarData,
    createdAt: new Date()
  }
}