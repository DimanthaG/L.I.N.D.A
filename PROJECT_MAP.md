# L.I.N.D.A - Visual Project Map

## 🗺️ Complete Project Visualization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         L.I.N.D.A PROJECT                                │
│     Leveraged Investment Narrative Discovery & Analysis                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          📚 DOCUMENTATION (14 files)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🚀 Getting Started                                                      │
│  ├── GETTING_STARTED.md     Complete setup walkthrough                  │
│  ├── QUICKSTART.md          5-minute quick start                        │
│  └── README.md              Main project documentation                  │
│                                                                          │
│  🏗️ Architecture                                                         │
│  ├── ARCHITECTURE.md        System architecture overview                │
│  ├── MODULE_DESIGN.md       NestJS module architecture                  │
│  ├── DATABASE_SCHEMA.md     Complete database schema                    │
│  └── FILE_STRUCTURE.md      File organization guide                     │
│                                                                          │
│  💻 Development                                                          │
│  ├── IMPLEMENTATION_PLAN.md 12-phase implementation guide               │
│  ├── API_ENDPOINTS.md       Complete API reference                      │
│  └── TESTING.md             Testing strategy & examples                 │
│                                                                          │
│  🚢 Operations                                                           │
│  ├── DEPLOYMENT.md          Production deployment guide                 │
│  ├── PROJECT_SUMMARY.md     Project overview & stats                    │
│  ├── PROJECT_OVERVIEW.md    Visual project summary                      │
│  └── DOCUMENTATION_INDEX.md Documentation catalog                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       🔧 BACKEND (NestJS) - 60+ files                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📦 Entities (11 files)                                                  │
│  ├── user.entity.ts              User accounts                          │
│  ├── reddit-account.entity.ts    Tracked Reddit accounts                │
│  ├── post.entity.ts              Reddit posts                           │
│  ├── post-analysis.entity.ts     Analysis results                       │
│  ├── ticker-mention.entity.ts    Ticker tracking                        │
│  ├── strategy.entity.ts          Investment strategies                  │
│  ├── watchlist.entity.ts         User watchlists                        │
│  ├── watchlist-ticker.entity.ts  Watchlist tickers                      │
│  ├── user-saved-strategy.entity.ts Saved strategies                     │
│  ├── api-rate-limit.entity.ts    Rate limit tracking                    │
│  └── job-log.entity.ts           Job execution logs                     │
│                                                                          │
│  🔐 Auth Module (12 files)                                              │
│  ├── auth.service.ts             Registration & login logic             │
│  ├── auth.controller.ts          Auth endpoints                         │
│  ├── jwt.strategy.ts             JWT validation                         │
│  ├── jwt-auth.guard.ts           Route protection                       │
│  ├── roles.guard.ts              RBAC implementation                    │
│  └── DTOs, decorators, interfaces                                       │
│                                                                          │
│  🐦 Reddit Module (7 files)                                             │
│  ├── reddit.service.ts           Post sync orchestration                │
│  ├── reddit-api.service.ts       Reddit API client                      │
│  ├── reddit-account.service.ts   Account management                     │
│  ├── reddit.controller.ts        Reddit endpoints                       │
│  └── DTOs                                                                │
│                                                                          │
│  📝 Post Module (3 files)                                               │
│  ├── post.service.ts             Post queries & filtering               │
│  └── post.controller.ts          Post endpoints                         │
│                                                                          │
│  🤖 Analysis Module (6 files)                                           │
│  ├── analysis.service.ts         Analysis orchestration                 │
│  ├── sentiment.service.ts        Sentiment analysis (NLP)               │
│  ├── ticker.service.ts           Ticker extraction                      │
│  ├── theme.service.ts            Theme detection                        │
│  └── analysis.controller.ts      Analysis endpoints                     │
│                                                                          │
│  🎯 Strategy Module (3 files)                                           │
│  ├── strategy.service.ts         Strategy generation                    │
│  └── strategy.controller.ts      Strategy endpoints                     │
│                                                                          │
│  📋 Watchlist Module (6 files)                                          │
│  ├── watchlist.service.ts        Watchlist management                   │
│  ├── watchlist.controller.ts     Watchlist endpoints                    │
│  └── DTOs                                                                │
│                                                                          │
│  ⚙️ Job Module (6 files)                                                │
│  ├── job.service.ts              Job scheduling                         │
│  ├── sync.processor.ts           Post sync jobs                         │
│  ├── analysis.processor.ts       Analysis jobs                          │
│  └── strategy.processor.ts       Strategy jobs                          │
│                                                                          │
│  👤 User Module (3 files)                                               │
│  ├── user.service.ts             User management                        │
│  └── user.controller.ts          User endpoints                         │
│                                                                          │
│  🔧 Common Services (4 files)                                           │
│  ├── logger.service.ts           Winston logging                        │
│  └── cache.service.ts            Redis caching                          │
│                                                                          │
│  ❤️ Health Module (2 files)                                             │
│  └── health.controller.ts        Health check endpoint                  │
│                                                                          │
│  🗄️ Database (2 files)                                                  │
│  ├── typeorm.config.ts           Database configuration                 │
│  └── InitialSchema.ts            Database migration                     │
│                                                                          │
│  🌱 Seeds (1 file)                                                       │
│  └── seed.ts                     Initial data seeder                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      🎨 FRONTEND (Next.js) - 30+ files                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📄 Pages (7 files)                                                      │
│  ├── page.tsx                    Landing page                           │
│  ├── login/page.tsx              Login page                             │
│  ├── register/page.tsx           Registration page                      │
│  ├── dashboard/page.tsx          Main dashboard                         │
│  ├── dashboard/analysis/page.tsx Analysis page                          │
│  ├── dashboard/strategy/page.tsx Strategy page                          │
│  └── dashboard/watchlists/page.tsx Watchlists page                      │
│                                                                          │
│  🧩 Components (7 files)                                                │
│  ├── DashboardLayout.tsx         Main layout with sidebar              │
│  ├── SentimentChart.tsx          Pie chart component                    │
│  ├── TickerList.tsx              Ticker list component                  │
│  ├── ThemeCloud.tsx              Theme visualization                    │
│  ├── PostFeed.tsx                Post list component                    │
│  ├── StrategyOverview.tsx        Strategy display                       │
│  └── TimeRangeSelector.tsx       Time filter component                  │
│                                                                          │
│  🪝 Custom Hooks (5 files)                                              │
│  ├── useAuth.ts                  Authentication hook                    │
│  ├── usePosts.ts                 Post data fetching                     │
│  ├── useAnalysis.ts              Analysis data fetching                 │
│  ├── useStrategy.ts              Strategy operations                    │
│  └── useWatchlists.ts            Watchlist management                   │
│                                                                          │
│  🛠️ Utilities (2 files)                                                 │
│  ├── api-client.ts               Axios API client                       │
│  └── utils.ts                    Helper functions                       │
│                                                                          │
│  💾 State Management (1 file)                                           │
│  └── useFilterStore.ts           Filter state (Zustand)                 │
│                                                                          │
│  📘 Types (1 file)                                                       │
│  └── index.ts                    TypeScript interfaces                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        🐳 INFRASTRUCTURE (11 files)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Docker                                                                  │
│  ├── docker-compose.yml          Development environment                │
│  ├── docker-compose.prod.yml     Production environment                 │
│  ├── backend/Dockerfile           Backend container                     │
│  ├── frontend/Dockerfile          Frontend container                    │
│  ├── .dockerignore                Docker ignore rules                   │
│  └── .env.example                 Environment template                  │
│                                                                          │
│  Nginx                                                                   │
│  └── nginx/nginx.conf             Reverse proxy config                  │
│                                                                          │
│  Scripts                                                                 │
│  ├── scripts/setup.sh             Automated setup                       │
│  ├── scripts/reset-db.sh          Database reset                        │
│  └── scripts/backup-db.sh         Database backup                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         🔄 DATA FLOW VISUALIZATION                       │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  Reddit API  │
    └──────┬───────┘
           │ Every 10 min
           ▼
    ┌──────────────┐
    │  Sync Job    │
    │  (BullMQ)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  PostgreSQL  │◄────┐
    │  (Raw Posts) │     │
    └──────┬───────┘     │
           │             │
           │ Every 5 min │
           ▼             │
    ┌──────────────┐     │
    │ Analysis Job │     │
    │  (BullMQ)    │     │
    └──────┬───────┘     │
           │             │
           ▼             │
    ┌──────────────┐     │
    │  Analysis    │─────┘
    │  Engine      │
    └──────┬───────┘
           │
           │ Every hour
           ▼
    ┌──────────────┐
    │ Strategy Job │
    │  (BullMQ)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Strategy    │
    │  Engine      │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Redis Cache  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  REST API    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Next.js     │
    │  Dashboard   │
    └──────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         🎯 FEATURE MAP                                   │
└─────────────────────────────────────────────────────────────────────────┘

Authentication        Reddit Integration      Analysis Engine
├── Register         ├── Account Tracking    ├── Sentiment Analysis
├── Login            ├── Post Ingestion      ├── Ticker Extraction
├── JWT Tokens       ├── Rate Limiting       ├── Theme Detection
├── Refresh          ├── Retry Logic         └── Macro Signals
└── RBAC             └── Engagement Scoring

Strategy Generation   User Features          Background Jobs
├── Bullish Ideas    ├── Watchlists         ├── Sync Job (10min)
├── Bearish Risks    ├── Saved Strategies   ├── Analysis Job (5min)
├── Consensus        ├── Custom Filters     └── Strategy Job (1hr)
├── Confidence       └── Time Ranges
└── Reports

┌─────────────────────────────────────────────────────────────────────────┐
│                         🗂️ DATABASE MAP                                  │
└─────────────────────────────────────────────────────────────────────────┘

Core Tables          Analysis Tables        User Tables
├── users            ├── post_analysis      ├── watchlists
├── reddit_accounts  ├── ticker_mentions    ├── watchlist_accounts
└── posts            └── strategies         ├── watchlist_tickers
                                            └── user_saved_strategies

System Tables
├── api_rate_limits
└── job_logs

┌─────────────────────────────────────────────────────────────────────────┐
│                         🌐 API MAP (30+ endpoints)                       │
└─────────────────────────────────────────────────────────────────────────┘

/auth                /reddit                /posts
├── POST register    ├── GET accounts       ├── GET /
├── POST login       ├── POST accounts      ├── GET /top
├── POST refresh     ├── DELETE /:id        ├── GET /:id
└── GET profile      ├── POST /:id/sync     └── GET /account/:id
                     └── POST sync-all

/analysis            /strategy              /watchlists
├── GET sentiment    ├── GET current        ├── GET /
├── GET tickers      ├── GET history        ├── POST /
├── GET sectors      ├── POST generate      ├── PUT /:id
└── GET themes       ├── POST save/:id      ├── DELETE /:id
                     └── GET saved          ├── POST /:id/tickers
                                            └── DELETE /:id/tickers/:ticker

/health
└── GET /

┌─────────────────────────────────────────────────────────────────────────┐
│                         📱 UI MAP (7 pages)                              │
└─────────────────────────────────────────────────────────────────────────┘

Public Pages         Dashboard Pages
├── / (Landing)      ├── /dashboard (Main)
├── /login           ├── /dashboard/analysis
└── /register        ├── /dashboard/strategy
                     └── /dashboard/watchlists

┌─────────────────────────────────────────────────────────────────────────┐
│                         ⚙️ TECHNOLOGY MAP                                │
└─────────────────────────────────────────────────────────────────────────┘

Backend Stack                Frontend Stack              Infrastructure
├── NestJS 10               ├── Next.js 14              ├── Docker
├── TypeScript 5            ├── React 18                ├── Docker Compose
├── PostgreSQL 15           ├── TypeScript 5            ├── Nginx
├── TypeORM 0.3             ├── Tailwind CSS 3          ├── Redis
├── Redis 7                 ├── React Query 5           └── BullMQ
├── BullMQ 5                ├── Zustand 4
├── Passport JWT            ├── Recharts 2
├── Winston 3               └── Lucide Icons
├── Natural (NLP)
└── Sentiment

┌─────────────────────────────────────────────────────────────────────────┐
│                         📊 PROJECT STATISTICS                            │
└─────────────────────────────────────────────────────────────────────────┘

Code Files                   Lines of Code               Documentation
├── Backend: 60+ files      ├── Backend: ~5,000         ├── 14 files
├── Frontend: 30+ files     ├── Frontend: ~3,000        ├── 4,000+ lines
├── Config: 20+ files       └── Total: ~8,000+          └── 35,000+ words
└── Total: ~110 files

API Endpoints               Database                     Features
├── Auth: 4                ├── Tables: 11               ├── Core: 10
├── Reddit: 6              ├── Indexes: 20+             ├── Advanced: 15
├── Posts: 4               └── Migrations: 1            └── Total: 25+
├── Analysis: 4
├── Strategy: 5
├── Watchlists: 7
└── Total: 30+

┌─────────────────────────────────────────────────────────────────────────┐
│                         🎯 QUICK ACCESS                                  │
└─────────────────────────────────────────────────────────────────────────┘

Want to...                          Read this...
├── Get started quickly            → QUICKSTART.md
├── Understand everything          → GETTING_STARTED.md
├── Learn the architecture         → ARCHITECTURE.md
├── Use the API                    → API_ENDPOINTS.md
├── Deploy to production           → DEPLOYMENT.md
├── Write tests                    → TESTING.md
├── Find a file                    → FILE_STRUCTURE.md
├── See all features               → FEATURES.md
├── Get project overview           → PROJECT_OVERVIEW.md
└── Find documentation             → DOCUMENTATION_INDEX.md

┌─────────────────────────────────────────────────────────────────────────┐
│                         🚀 DEPLOYMENT OPTIONS                            │
└─────────────────────────────────────────────────────────────────────────┘

Local Development        Cloud Platforms           Container Orchestration
├── Docker Compose      ├── AWS (ECS/RDS)         ├── Kubernetes
├── Manual Setup        ├── GCP (Cloud Run)       ├── Docker Swarm
└── Hot Reload          ├── Vercel + Railway      └── Nomad
                        └── Heroku

┌─────────────────────────────────────────────────────────────────────────┐
│                         ✅ COMPLETION STATUS                             │
└─────────────────────────────────────────────────────────────────────────┘

Backend                 Frontend                Infrastructure
✅ 100% Complete       ✅ 100% Complete        ✅ 100% Complete
├── ✅ Auth            ├── ✅ Pages            ├── ✅ Docker
├── ✅ Reddit API      ├── ✅ Components       ├── ✅ Compose
├── ✅ Analysis        ├── ✅ Hooks            ├── ✅ Nginx
├── ✅ Strategy        ├── ✅ API Client       └── ✅ Scripts
├── ✅ Jobs            └── ✅ Styling
└── ✅ Database

Documentation          Testing                 Deployment
✅ 100% Complete      ✅ Strategy Ready       ✅ Configs Ready
├── ✅ 14 MD files    ├── ✅ Test setup       ├── ✅ Docker
├── ✅ API docs       ├── ✅ Examples         ├── ✅ Compose
└── ✅ Guides         └── ✅ Guides           └── ✅ Cloud guides

┌─────────────────────────────────────────────────────────────────────────┐
│                         🎊 PROJECT READY                                 │
└─────────────────────────────────────────────────────────────────────────┘

✨ All components implemented
✨ All documentation complete
✨ Ready for local development
✨ Ready for production deployment
✨ Ready for feature extensions

Next Steps:
1. Get Reddit API credentials
2. Run: docker-compose up -d
3. Run: docker-compose exec backend npm run migration:run
4. Run: docker-compose exec backend npm run seed
5. Open: http://localhost:3000

🎉 Start analyzing Reddit investment sentiment now!
