# Trading AI Analysis Platform

An AI-powered trading analysis application with support for Forex, Metals, Crypto, and Stocks markets. Features dual AI provider support (Anthropic Claude + OpenAI GPT), vector memory system with Pinecone, and real-time market data integration.

## Features

- 🔐 User authentication and session management
- 🤖 Dual AI provider support (Anthropic Claude + OpenAI GPT)
- 🧠 Vector memory system with Pinecone for context-aware responses
- 📊 Real-time market data (Forex, Metals, Crypto, Stocks)
- 💬 AI conversation system with streaming responses and RAG
- 📝 Trading journal and documentation
- 📚 Strategies, tools, and playbooks management
- 📖 Pre-built ICT and Scalping knowledge base

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Anthropic Claude & OpenAI GPT
- **Vector DB**: Pinecone for embeddings and semantic search
- **Embeddings**: OpenAI text-embedding-3-small
- **Market Data**: Polygon API
- **Charts**: TradingView Lightweight Charts

## Getting Started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Visit http://localhost:3000

## Implementation Status

✅ Phase 1: Authentication
✅ Phase 2: Layout & Navigation
✅ Phase 3: AI Integration
✅ Phase 4: Vector Memory System
✅ Phase 5: Market Data & Charts
✅ Phase 6: Journal System

## Environment Variables

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# AI Providers
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Vector Memory (Optional)
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=your-index-name

# Market Data (Optional)
POLYGON_API_KEY=your-polygon-key
```

## License

MIT
