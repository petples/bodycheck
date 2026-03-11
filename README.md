# BodyCheck - AI 中醫體質測試遊戲

> 用聊天的方式，輕鬆了解你的中醫體質 🐱

## 專案簡介

BodyCheck 是一個創新的中醫體質評估工具，透過 AI 對話的方式，讓用家在自然聊天中完成體質評估，告別傳統枯燥的問卷填寫體驗。

### 核心特色

- 🎯 **非順序提問** — AI 根據對話自然引導話題
- 💬 **輕鬆聊天風格** — 像朋友傾計，不知不覺完成評估
- 📊 **圖文並茂結果** — 雷達圖 + 體質卡片 + 健康建議
- 🔒 **隱私優先** — 數據安全，可匿名使用

## 技術棧

- **Frontend:** Vue 3 / React + TailwindCSS
- **Backend:** Node.js + Express
- **AI:** OpenAI API / Claude API
- **Charts:** ECharts

## 快速開始

```bash
# 克隆項目
git clone https://github.com/petples/bodycheck.git

# 進入目錄
cd bodycheck

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

## 專案結構

```
bodycheck/
├── frontend/          # 前端代碼
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   └── utils/
├── backend/           # 後端代碼
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
├── docs/              # 文檔
└── README.md
```

## 開發進度

- [ ] 基礎架構搭建
- [ ] AI 對話引擎
- [ ] 評分算法
- [ ] 結果展示頁面
- [ ] 部署上線

## 授權

MIT License

---

**開發文檔詳見：** [開發文檔](./docs/DEV.md)
