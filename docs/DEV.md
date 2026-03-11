# BodyCheck - 中醫體質測試遊戲 開發文檔

> **項目名稱：** BodyCheck - AI 中醫體質測試遊戲  
> **GitHub：** https://github.com/petples/bodycheck  
> **本地路徑：** D:\Documents\DM\Projects\bodycheck  
> **創建日期：** 2026-03-12  
> **風格定位：** 輕鬆聊天風 + AI 輔助  
> **版本：** 1.0

---

## 一、項目概述

### 1.1 核心理念

**「不知不覺間完成評估」**

用家透過與 AI 自然對話，在輕鬆聊天過程中，AI 會從對話內容智能提取相關資訊，最終生成中醫體質評估報告。用家不會感覺自己在填問卷，而是在與一位關心健康的朋友聊天。

### 1.2 核心特色

- 🎯 **非順序提問** — AI 根據用家回答，自然引導話題
- 💬 **輕鬆聊天風格** — 像朋友傾計，不知不覺完成評估
- 📊 **圖文並茂結果** — 雷達圖 + 體質卡片 + 健康建議
- 🔒 **隱私優先** — 數據本地處理，可匿名使用
- 🤖 **AI 輔助** — 用 GPT/Claude 進行智能對話

### 1.3 目標用家

- 25-45 歲關注健康的都市人
- 對中醫體質感興趣但不想填傳統問卷
- 喜歡輕鬆、有趣的互動體驗
- 習慣使用聊天機器人/對話式界面

---

## 二、遊戲流程設計

### 2.1 整體流程

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   開場介紹   │ -> │   AI 對話   │ -> │   評估完成   │ -> │   結果展示   │
│  (角色設定)  │    │  (資訊收集)  │    │  (算法計算)  │    │  (圖文報告)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      1-2分           5-10分            即時              2-3分
```

### 2.2 詳細流程

#### 階段一：開場介紹 (1-2 分鐘)

**目的：** 建立信任，設定場景

**AI 開場白：**
> 「你好呀！我係小健 🐱，一個關心你健康嘅 AI 朋友。
> 
> 今日想同你傾下計，了解一下你近排嘅身體狀況。唔使緊張，當傾計就得㗎啦！
> 
> 我會問你一啲生活上嘅小事，你照實答就得。準備好未？😊」

**用家可選：**
- 「好啊，開始吧！」→ 進入對話
- 「呢個係咩測試？」→ AI 解釋
- 「我唔想做了」→ 禮貌結束

#### 階段二：AI 對話 (5-10 分鐘)

**核心機制：**

1. **非順序提問** — AI 根據用家回答，自然引導話題
2. **上下文理解** — AI 記住已收集的資訊，避免重複
3. **情感回應** — AI 對用家回答給予共情回饋
4. **智能提取** — 從自然對話中提取量表所需的評分

**對話範例：**

```
AI: 你平日返工忙唔忙呀？會唔會好容易攰？

用家: 都幾忙下，成日要做到好夜先走，搞到成日都好攰。

AI: 辛苦曬你啦 💪 咁你攰嘅時候，會唔會覺得氣促、接唔上氣嗰種？

用家: 好似都有啱，特別係趕住搭車嗰陣。

AI: 明白明。咁平時有冇試過無啦啦頭暈？譬如起身嗰陣？

用家: 有時都有㗎，尤其係坐好耐之後突然起身。

AI: 了解了。咁講開又講，你覺得自己係一個比較容易緊張定係好 chill 嗰種？
```

**資訊提取邏輯：**

| 用家回答 | AI 提取 | 對應題目 |
|---------|--------|---------|
| 「成日都好攰」 | 容易疲乏 = 經常 | Q2 |
| 「氣促、接唔上氣」 | 容易氣短 = 有時 | Q3 |
| 「起身嗰陣頭暈」 | 站起時暈眩 = 有時 | Q5 |
| 「容易緊張」 | 精神緊張 = 經常 | Q10 |

#### 階段三：評估完成 (即時計算)

**觸發條件：**
- 已收集足夠資訊（覆蓋 9 種體質核心題目）
- 或用家主動表示想看結果

**AI 提示：**
> 「好啦！我大概了解你嘅情況㗎啦。
> 
> 想唔想睇下你嘅體質評估結果？我可以幫你分析下！」

#### 階段四：結果展示

**內容結構：**

1. **體質雷達圖** — 9 種體質分數分佈
2. **主要體質** — 最突出的體質類型
3. **體質描述** — 圖文並茂的解釋
4. **健康建議** — 針對性的調理建議
5. **分享功能** — 可分享結果到社交平台

---

## 三、中醫體質分類與評分

### 3.1 九種體質

| 體質 | 特點 | 相關題目 |
|-----|------|---------|
| **平和質** | 健康、精力充沛、適應力強 | Q1, Q53 |
| **氣虛質** | 容易疲乏、氣短、聲音低弱 | Q2, Q3, Q4, Q5, Q6, Q7 |
| **陽虛質** | 怕冷、手腳涼、喜熱食 | Q18, Q19, Q20, Q22, Q52, Q55 |
| **陰虛質** | 手腳心熱、口乾咽燥、便秘 | Q17, Q21, Q29, Q46, Q57 |
| **痰濕質** | 腹部肥滿、多汗、胸悶 | Q28, Q39, Q42, Q50, Q51, Q58 |
| **濕熱質** | 面油多、口苦、小便黃 | Q38, Q48, Q49, Q59, Q60 |
| **血瘀質** | 面色晦暗、易瘀青、疼痛 | Q33, Q37, Q40, Q43, Q45 |
| **氣鬱質** | 情緒低落、容易緊張、歎氣 | Q9, Q10, Q11, Q12, Q13, Q15, Q47, Q54 |
| **特禀質** | 過敏、易感冒、皮膚敏感 | Q23, Q24, Q25, Q26, Q30, Q31, Q32, Q34 |

### 3.2 評分算法

```
每種體質分數 = (相關題目得分總和) / (題目數量 × 5) × 100

判定標準：
- 分數 >= 60 → 該體質「明顯」
- 分數 40-59 → 該體質「有傾向」
- 分數 < 40 → 該體質「不明顯」
```

### 3.3 主體質判定

取分數最高的體質為主體質，如平和質分數最高且其他體質均不明顯，判定為「平和質（健康）」。

---

## 四、技術架構

### 4.1 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  聊天界面   │  │  結果展示   │  │  動畫效果   │      │
│  │  (Vue 3)   │  │  (ECharts)  │  │  (CSS)      │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / WebSocket
┌───────────────────────▼─────────────────────────────────┐
│                      Backend                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  API 服務   │  │  AI Engine  │  │  評分引擎   │      │
│  │  (Express) │  │ (OpenAI)    │  │  (算法)     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │  Session    │  │  Results    │                       │
│  │  Manager    │  │  Storage    │                       │
│  └─────────────┘  └─────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### 4.2 技術選型

#### Frontend

| 技術 | 用途 | 版本 |
|-----|------|------|
| **Vue 3** | 前端框架 | ^3.4 |
| **Vite** | 構建工具 | ^5.0 |
| **TailwindCSS** | 樣式 | ^3.4 |
| **ECharts** | 雷達圖 | ^5.4 |
| **Pinia** | 狀態管理 | ^2.1 |
| **VueUse** | 實用工具 | ^10.0 |

#### Backend

| 技術 | 用途 | 版本 |
|-----|------|------|
| **Node.js** | 運行環境 | ^20 |
| **Express** | Web 框架 | ^4.18 |
| **OpenAI SDK** | AI API | ^4.0 |
| **dotenv** | 環境變量 | ^16.0 |
| **cors** | 跨域 | ^2.8 |
| **uuid** | ID 生成 | ^9.0 |

### 4.3 項目結構

```
bodycheck/
├── frontend/                    # 前端項目
│   ├── src/
│   │   ├── assets/             # 靜態資源
│   │   ├── components/         # Vue 组件
│   │   │   ├── ChatMessage.vue    # 聊天訊息
│   │   │   ├── ChatInput.vue      # 輸入框
│   │   │   ├── ResultCard.vue     # 結果卡片
│   │   │   ├── RadarChart.vue     # 雷達圖
│   │   │   └── TypeBadge.vue      # 體質標籤
│   │   ├── composables/       # Vue Composables
│   │   │   ├── useChat.ts         # 聊天邏輯
│   │   │   ├── useResult.ts       # 結果處理
│   │   │   └── useAI.ts           # AI 交互
│   │   ├── stores/            # Pinia 狀態
│   │   │   ├── session.ts         # 會話狀態
│   │   │   └── result.ts          # 結果狀態
│   │   ├── views/             # 頁面
│   │   │   ├── Home.vue           # 首頁
│   │   │   ├── Chat.vue           # 對話頁
│   │   │   └── Result.vue         # 結果頁
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # 後端項目
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.ts           # 對話 API
│   │   │   ├── result.ts         # 結果 API
│   │   │   └── health.ts         # 健康檢查
│   │   ├── services/
│   │   │   ├── ai.ts             # AI 服務
│   │   │   ├── scoring.ts        # 評分服務
│   │   │   └── session.ts        # 會話服務
│   │   ├── utils/
│   │   │   ├── types.ts          # 類型定義
│   │   │   └── constants.ts      # 常量
│   │   └── index.ts
│   ├── package.json
│   └── .env.example
│
├── docs/                        # 文檔
│   ├── DEV.md                   # 開發文檔
│   └── API.md                   # API 文檔
│
├── .gitignore
├── README.md
└── package.json                 # 根 package.json (npm workspaces)
```

---

## 五、AI 對話引擎設計

### 5.1 System Prompt

```
你是一位關心用家健康的中醫體質評估助手「小健」。

你的任務：
1. 以輕鬆聊天的方式了解用家的身體狀況
2. 從對話中自然地收集體質評估所需的資訊
3. 對用家的分享給予共情和鼓勵

對話風格：
- 像朋友一樣親切、溫暖
- 使用廣東話（繁體中文）
- 適當使用 emoji 增加親和力
- 不生硬地問問題，而是從話題自然延伸

你需要了解的資訊類別：
1. 精力與疲勞程度
2. 呼吸與心血管狀況
3. 情緒與心理狀態
4. 怕冷或怕熱的情況
5. 過敏與免疫力
6. 皮膚與外觀
7. 消化與排泄
8. 睡眠品質

當收集到足夠資訊後，禮貌地告知用家可以查看結果。

請在每次回覆後，以 JSON 格式輸出你從用家回答中提取的資訊：
{
  "extracted": {
    "題目編號": "評估分數(1-5)"
  }
}
```

### 5.2 對話狀態管理

```typescript
interface SessionState {
  sessionId: string;
  messages: ChatMessage[];
  extractedData: Record<string, number>;  // 題目編號: 分數
  coveredTopics: string[];                // 已覆蓋話題
  progress: number;                       // 進度 0-100
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.3 話題引導邏輯

```typescript
// 話題優先級
const topicPriority = [
  'energy',      // 精力
  'breathing',   // 呼吸
  'emotion',     // 情緒
  'temperature', // 溫度
  'allergy',     // 過敏
  'skin',        // 皮膚
  'digestion',   // 消化
  'sleep'        // 睡眠
];

function getNextTopic(session: SessionState): string | null {
  const covered = new Set(session.coveredTopics);
  return topicPriority.find(t => !covered.has(t)) || null;
}
```

---

## 六、API 設計

### 6.1 會話 API

#### 創建會話
```
POST /api/session
Response: { sessionId: string }
```

#### 發送訊息
```
POST /api/chat
Body: { sessionId: string, message: string }
Response: { 
  reply: string,
  extracted: Record<string, number>,
  progress: number,
  isComplete: boolean
}
```

#### 獲取結果
```
GET /api/result/:sessionId
Response: {
  bodyTypes: BodyTypeResult[],
  primaryType: string,
  description: string,
  suggestions: string[]
}
```

---

## 七、數據模型

### 7.1 體質結果

```typescript
interface BodyTypeResult {
  name: string;           // 體質名稱
  nameEn: string;         // 英文名稱
  score: number;          // 分數 0-100
  level: '明顯' | '有傾向' | '不明顯';
  description: string;    // 描述
  suggestions: string[];  // 建議
}

interface AssessmentResult {
  sessionId: string;
  primaryType: string;    // 主體質
  bodyTypes: BodyTypeResult[];
  radarData: number[];    // 雷達圖數據
  createdAt: Date;
}
```

---

## 八、開發計劃

### Phase 1：基礎架構 (1-2 週)

- [ ] 初始化 Vue 3 + Vite 前端
- [ ] 初始化 Express 後端
- [ ] 設置 npm workspaces
- [ ] 配置 TailwindCSS
- [ ] 實現基礎路由

### Phase 2：核心功能 (2-3 週)

- [ ] AI 對話引擎
- [ ] 評分算法實現
- [ ] Session 管理
- [ ] 基礎聊天界面

### Phase 3：用家體驗 (1-2 週)

- [ ] 結果頁面設計
- [ ] ECharts 雷達圖
- [ ] 動畫效果
- [ ] 響應式設計

### Phase 4：優化與部署 (1 週)

- [ ] 性能優化
- [ ] 錯誤處理
- [ ] 部署配置
- [ ] 測試與修復

---

## 九、環境變量

### 前端 (.env)
```
VITE_API_URL=http://localhost:3000
```

### 後端 (.env)
```
PORT=3000
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4
SESSION_SECRET=your-secret-key
```

---

## 十、風險與緩解

| 風險 | 影響 | 緩解措施 |
|-----|------|---------|
| AI 回覆不穩定 | 體驗不佳 | 設置回退機制，準備fallback回答 |
| API 成本過高 | 預算超支 | 使用較便宜的模型，設置用量上限 |
| 評分不準確 | 結果不可信 | 多次測試優化，提供免責聲明 |

---

## 十一、參考資料

- 原始量表：中醫體質量表 V2.0 繁體版
- Vue 3 文檔：https://vuejs.org/
- Express 文檔：https://expressjs.com/
- OpenAI API：https://platform.openai.com/

---

**文檔版本：** 1.0  
**最後更新：** 2026-03-12  
**維護者：** Cat 🐱