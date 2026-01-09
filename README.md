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

## Quick Start

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Visit [http://localhost:3006](http://localhost:3006)

For detailed setup instructions, see the [Getting Started Guide](docs/getting-started.md).

## Documentation

### Core Guides

- 📘 [Getting Started](docs/getting-started.md) - Complete installation and setup guide
- 🏗️ [Architecture Overview](docs/architecture.md) - System design and data flow
- 🔧 [API Reference](docs/api-reference.md) - Complete API documentation (39 endpoints)
- ❓ [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

### Feature Guides

- 💬 [AI Chat](docs/features/chat.md) - Dual AI providers with streaming and memory
- 📓 [Trading Journal](docs/features/journal.md) - Track trades with emotional analysis
- 📈 [Market Charts](docs/features/charts.md) - Real-time data with ICT pattern detection
- 🎯 [Strategies](docs/features/strategies.md) - Trading strategy management
- 🛠️ [Tools](docs/features/tools.md) - External tool organization
- 📋 [Playbooks](docs/features/playbooks.md) - Step-by-step execution guides
- 📚 [Knowledge Base](docs/features/knowledge-base.md) - ICT & Scalping documentation
- ⚙️ [Settings](docs/features/settings.md) - User preferences and configuration

### System Documentation

- 🧠 [Vector Memory System](docs/systems/memory-system.md) - Pinecone RAG implementation
- 🤖 [AI Providers](docs/systems/ai-providers.md) - Claude & GPT configuration
- 📊 [Market Data](docs/systems/market-data.md) - Polygon API integration

### Database Reference

- 🗄️ [Database Schema](docs/database/schema.md) - Complete model reference
- 🔄 [Migrations](docs/database/migrations.md) - Database setup and updates

## Implementation Status

✅ Phase 1: Authentication
✅ Phase 2: Layout & Navigation
✅ Phase 3: AI Integration
✅ Phase 4: Vector Memory System
✅ Phase 5: Market Data & Charts
✅ Phase 6: Journal System
✅ Phase 7: Strategies, Tools & Playbooks
✅ Phase 8: Knowledge Base (ICT & Scalping)
✅ Phase 9: Polish & Optimization

### Phase 9 Improvements

- Toast notification system for user feedback
- Error boundaries for graceful error handling
- Empty state components for better UX
- Settings page with backend persistence
- User profile management with password change
- Chat-to-Journal save functionality
- Consistent light theme across all pages
- Input validation on API endpoints

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
