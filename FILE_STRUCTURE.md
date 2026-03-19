# Complete File Structure

```
L.I.N.D.A/
│
├── 📄 README.md                           # Main project documentation
├── 📄 ARCHITECTURE.md                     # System architecture overview
├── 📄 DATABASE_SCHEMA.md                  # Database design and schema
├── 📄 IMPLEMENTATION_PLAN.md              # Implementation roadmap
├── 📄 MODULE_DESIGN.md                    # NestJS module architecture
├── 📄 API_ENDPOINTS.md                    # Complete API reference
├── 📄 FEATURES.md                         # Feature documentation
├── 📄 QUICKSTART.md                       # 5-minute setup guide
├── 📄 DEPLOYMENT.md                       # Production deployment guide
├── 📄 TESTING.md                          # Testing strategy
├── 📄 GETTING_STARTED.md                  # Comprehensive getting started
├── 📄 PROJECT_SUMMARY.md                  # Project overview
├── 📄 FILE_STRUCTURE.md                   # This file
│
├── 🐳 docker-compose.yml                  # Development Docker config
├── 🐳 docker-compose.prod.yml             # Production Docker config
├── 📄 .env.example                        # Environment template
├── 📄 .gitignore                          # Git ignore rules
├── 📄 .dockerignore                       # Docker ignore rules
│
├── 📁 backend/                            # NestJS Backend Application
│   ├── 📁 src/
│   │   ├── 📁 config/                    # Configuration
│   │   │   └── 📄 typeorm.config.ts      # TypeORM database config
│   │   │
│   │   ├── 📁 entities/                  # Database Entities (11 files)
│   │   │   ├── 📄 user.entity.ts
│   │   │   ├── 📄 reddit-account.entity.ts
│   │   │   ├── 📄 post.entity.ts
│   │   │   ├── 📄 post-analysis.entity.ts
│   │   │   ├── 📄 ticker-mention.entity.ts
│   │   │   ├── 📄 strategy.entity.ts
│   │   │   ├── 📄 watchlist.entity.ts
│   │   │   ├── 📄 watchlist-ticker.entity.ts
│   │   │   ├── 📄 user-saved-strategy.entity.ts
│   │   │   ├── 📄 api-rate-limit.entity.ts
│   │   │   └── 📄 job-log.entity.ts
│   │   │
│   │   ├── 📁 modules/                   # Feature Modules
│   │   │   │
│   │   │   ├── 📁 auth/                 # Authentication Module
│   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📄 register.dto.ts
│   │   │   │   │   └── 📄 login.dto.ts
│   │   │   │   ├── 📁 guards/
│   │   │   │   │   ├── 📄 jwt-auth.guard.ts
│   │   │   │   │   └── 📄 roles.guard.ts
│   │   │   │   ├── 📁 decorators/
│   │   │   │   │   ├── 📄 public.decorator.ts
│   │   │   │   │   ├── 📄 roles.decorator.ts
│   │   │   │   │   └── 📄 current-user.decorator.ts
│   │   │   │   ├── 📁 strategies/
│   │   │   │   │   └── 📄 jwt.strategy.ts
│   │   │   │   ├── 📁 interfaces/
│   │   │   │   │   └── 📄 jwt-payload.interface.ts
│   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   ├── 📄 auth.service.ts
│   │   │   │   └── 📄 auth.controller.ts
│   │   │   │
│   │   │   ├── 📁 user/                 # User Module
│   │   │   │   ├── 📄 user.module.ts
│   │   │   │   ├── 📄 user.service.ts
│   │   │   │   └── 📄 user.controller.ts
│   │   │   │
│   │   │   ├── 📁 reddit/               # Reddit Integration Module
│   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📄 create-reddit-account.dto.ts
│   │   │   │   │   └── 📄 update-reddit-account.dto.ts
│   │   │   │   ├── 📄 reddit.module.ts
│   │   │   │   ├── 📄 reddit.service.ts
│   │   │   │   ├── 📄 reddit-api.service.ts
│   │   │   │   ├── 📄 reddit-account.service.ts
│   │   │   │   └── 📄 reddit.controller.ts
│   │   │   │
│   │   │   ├── 📁 post/                 # Post Module
│   │   │   │   ├── 📄 post.module.ts
│   │   │   │   ├── 📄 post.service.ts
│   │   │   │   └── 📄 post.controller.ts
│   │   │   │
│   │   │   ├── 📁 analysis/             # Analysis Module
│   │   │   │   ├── 📄 analysis.module.ts
│   │   │   │   ├── 📄 analysis.service.ts
│   │   │   │   ├── 📄 sentiment.service.ts
│   │   │   │   ├── 📄 ticker.service.ts
│   │   │   │   ├── 📄 theme.service.ts
│   │   │   │   └── 📄 analysis.controller.ts
│   │   │   │
│   │   │   ├── 📁 strategy/             # Strategy Module
│   │   │   │   ├── 📄 strategy.module.ts
│   │   │   │   ├── 📄 strategy.service.ts
│   │   │   │   └── 📄 strategy.controller.ts
│   │   │   │
│   │   │   ├── 📁 watchlist/            # Watchlist Module
│   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📄 create-watchlist.dto.ts
│   │   │   │   │   ├── 📄 update-watchlist.dto.ts
│   │   │   │   │   └── 📄 add-ticker.dto.ts
│   │   │   │   ├── 📄 watchlist.module.ts
│   │   │   │   ├── 📄 watchlist.service.ts
│   │   │   │   └── 📄 watchlist.controller.ts
│   │   │   │
│   │   │   └── 📁 job/                  # Background Jobs Module
│   │   │       ├── 📁 processors/
│   │   │       │   ├── 📄 sync.processor.ts
│   │   │       │   ├── 📄 analysis.processor.ts
│   │   │       │   └── 📄 strategy.processor.ts
│   │   │       ├── 📄 job.module.ts
│   │   │       └── 📄 job.service.ts
│   │   │
│   │   ├── 📁 common/                    # Shared Services
│   │   │   ├── 📁 logger/
│   │   │   │   ├── 📄 logger.module.ts
│   │   │   │   └── 📄 logger.service.ts
│   │   │   └── 📁 cache/
│   │   │       ├── 📄 cache.module.ts
│   │   │       └── 📄 cache.service.ts
│   │   │
│   │   ├── 📁 health/                    # Health Checks
│   │   │   ├── 📄 health.module.ts
│   │   │   └── 📄 health.controller.ts
│   │   │
│   │   ├── 📁 migrations/                # Database Migrations
│   │   │   └── 📄 1710000000000-InitialSchema.ts
│   │   │
│   │   ├── 📁 seeds/                     # Seed Data
│   │   │   └── 📄 seed.ts
│   │   │
│   │   ├── 📁 types/                     # Type Definitions
│   │   │   └── 📄 index.d.ts
│   │   │
│   │   ├── 📄 app.module.ts              # Root module
│   │   └── 📄 main.ts                    # Application entry point
│   │
│   ├── 📄 Dockerfile                      # Backend Docker image
│   ├── 📄 package.json                    # Dependencies and scripts
│   ├── 📄 tsconfig.json                   # TypeScript config
│   ├── 📄 nest-cli.json                   # NestJS CLI config
│   ├── 📄 .eslintrc.js                    # ESLint config
│   ├── 📄 .prettierrc                     # Prettier config
│   ├── 📄 .env.example                    # Environment template
│   ├── 📄 .gitignore                      # Git ignore
│   └── 📄 README.md                       # Backend documentation
│
├── 📁 frontend/                           # Next.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/                       # Next.js App Router
│   │   │   ├── 📁 dashboard/            # Dashboard Pages
│   │   │   │   ├── 📁 analysis/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 strategy/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 watchlists/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 layout.tsx            # Root layout
│   │   │   ├── 📄 page.tsx              # Landing page
│   │   │   ├── 📄 providers.tsx         # React Query provider
│   │   │   └── 📄 globals.css           # Global styles
│   │   │
│   │   ├── 📁 components/                # React Components
│   │   │   ├── 📁 layout/
│   │   │   │   └── 📄 DashboardLayout.tsx
│   │   │   ├── 📁 charts/
│   │   │   │   └── 📄 SentimentChart.tsx
│   │   │   ├── 📁 analysis/
│   │   │   │   ├── 📄 TickerList.tsx
│   │   │   │   └── 📄 ThemeCloud.tsx
│   │   │   ├── 📁 posts/
│   │   │   │   └── 📄 PostFeed.tsx
│   │   │   ├── 📁 strategy/
│   │   │   │   └── 📄 StrategyOverview.tsx
│   │   │   └── 📁 filters/
│   │   │       └── 📄 TimeRangeSelector.tsx
│   │   │
│   │   ├── 📁 hooks/                     # Custom React Hooks
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 usePosts.ts
│   │   │   ├── 📄 useAnalysis.ts
│   │   │   ├── 📄 useStrategy.ts
│   │   │   └── 📄 useWatchlists.ts
│   │   │
│   │   ├── 📁 lib/                       # Utilities
│   │   │   ├── 📄 api-client.ts         # Axios API client
│   │   │   └── 📄 utils.ts              # Helper functions
│   │   │
│   │   ├── 📁 store/                     # State Management
│   │   │   └── 📄 useFilterStore.ts     # Filter state (Zustand)
│   │   │
│   │   └── 📁 types/                     # TypeScript Types
│   │       └── 📄 index.ts
│   │
│   ├── 📄 Dockerfile                      # Frontend Docker image
│   ├── 📄 package.json                    # Dependencies and scripts
│   ├── 📄 tsconfig.json                   # TypeScript config
│   ├── 📄 next.config.js                  # Next.js config
│   ├── 📄 tailwind.config.ts              # Tailwind config
│   ├── 📄 postcss.config.js               # PostCSS config
│   ├── 📄 .env.example                    # Environment template
│   ├── 📄 .gitignore                      # Git ignore
│   └── 📄 README.md                       # Frontend documentation
│
├── 📁 nginx/                              # Nginx Reverse Proxy
│   └── 📄 nginx.conf                      # Nginx configuration
│
└── 📁 scripts/                            # Utility Scripts
    ├── 📄 setup.sh                        # Automated setup script
    ├── 📄 reset-db.sh                     # Database reset script
    └── 📄 backup-db.sh                    # Database backup script
```

## File Count Summary

### Backend
- **Entities**: 11 files
- **Modules**: 8 modules (40+ files total)
  - Auth: 12 files
  - User: 3 files
  - Reddit: 7 files
  - Post: 3 files
  - Analysis: 6 files
  - Strategy: 3 files
  - Watchlist: 6 files
  - Job: 6 files
- **Common**: 4 files
- **Health**: 2 files
- **Config**: 1 file
- **Migrations**: 1 file
- **Seeds**: 1 file
- **Types**: 1 file
- **Root**: 8 files

**Total Backend Files**: ~60 TypeScript files

### Frontend
- **Pages**: 7 page files
- **Components**: 7 component files
- **Hooks**: 5 hook files
- **Lib**: 2 utility files
- **Store**: 1 state file
- **Types**: 1 type file
- **Root**: 7 files

**Total Frontend Files**: ~30 TypeScript/TSX files

### Infrastructure
- **Docker**: 4 files
- **Nginx**: 1 file
- **Scripts**: 3 files
- **Root Config**: 3 files

**Total Infrastructure Files**: ~11 files

### Documentation
- **Markdown Files**: 13 files
- **Total Lines**: ~3,500 lines of documentation

## Grand Total
- **Code Files**: ~90 files
- **Config Files**: ~20 files
- **Documentation**: 13 files
- **Total Files**: ~123 files
- **Total Lines of Code**: ~8,000+ lines

## Key Directories Explained

### `/backend/src/entities/`
Database models using TypeORM decorators. Each entity represents a table in PostgreSQL.

### `/backend/src/modules/`
Feature modules following NestJS architecture. Each module is self-contained with its own services, controllers, and DTOs.

### `/backend/src/common/`
Shared services used across multiple modules (logger, cache).

### `/backend/src/migrations/`
Database schema migrations for version control of database structure.

### `/frontend/src/app/`
Next.js pages using the App Router. Each folder represents a route.

### `/frontend/src/components/`
Reusable React components organized by feature.

### `/frontend/src/hooks/`
Custom React hooks for data fetching and state management.

### `/frontend/src/lib/`
Utility functions and API client configuration.

### `/frontend/src/store/`
Zustand stores for client-side state management.

## Important Files

### Configuration
- `backend/src/config/typeorm.config.ts` - Database connection
- `backend/src/app.module.ts` - Root module with all imports
- `frontend/src/lib/api-client.ts` - API client with auth
- `docker-compose.yml` - Service orchestration

### Entry Points
- `backend/src/main.ts` - Backend application entry
- `frontend/src/app/layout.tsx` - Frontend root layout
- `frontend/src/app/page.tsx` - Landing page

### Core Logic
- `backend/src/modules/analysis/sentiment.service.ts` - Sentiment analysis
- `backend/src/modules/analysis/ticker.service.ts` - Ticker extraction
- `backend/src/modules/strategy/strategy.service.ts` - Strategy generation
- `backend/src/modules/reddit/reddit-api.service.ts` - Reddit API client

## File Naming Conventions

### Backend
- **Entities**: `*.entity.ts`
- **Services**: `*.service.ts`
- **Controllers**: `*.controller.ts`
- **Modules**: `*.module.ts`
- **DTOs**: `*.dto.ts`
- **Guards**: `*.guard.ts`
- **Decorators**: `*.decorator.ts`
- **Interfaces**: `*.interface.ts`

### Frontend
- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Components**: `ComponentName.tsx` (PascalCase)
- **Hooks**: `useHookName.ts` (camelCase with 'use' prefix)
- **Utilities**: `utils.ts`, `api-client.ts`
- **Stores**: `useStoreName.ts`

## Code Organization Principles

### Backend
1. **Module per feature**: Each feature is a self-contained module
2. **Service layer**: Business logic in services
3. **Controller layer**: HTTP handling in controllers
4. **Entity layer**: Database models
5. **DTO layer**: Data validation and transformation

### Frontend
1. **Page per route**: Each route has its own page file
2. **Component composition**: Small, reusable components
3. **Hook abstraction**: Data fetching logic in hooks
4. **Utility functions**: Shared logic in lib/
5. **Type safety**: TypeScript interfaces for all data

## Dependencies

### Backend (30+ packages)
- Core: NestJS, TypeScript, TypeORM
- Database: pg, redis
- Jobs: bull, bullmq
- Auth: passport, passport-jwt, bcrypt
- Validation: class-validator, class-transformer
- HTTP: axios
- Logging: winston
- Analysis: natural, sentiment

### Frontend (20+ packages)
- Core: Next.js, React, TypeScript
- Data: @tanstack/react-query, axios
- State: zustand
- Styling: tailwindcss
- Charts: recharts
- Forms: react-hook-form, zod
- Icons: lucide-react
- Utils: date-fns, clsx

## Build Artifacts

### Backend
- `dist/` - Compiled JavaScript
- `logs/` - Application logs
- `node_modules/` - Dependencies

### Frontend
- `.next/` - Next.js build output
- `out/` - Static export (if used)
- `node_modules/` - Dependencies

## Generated Files

### Runtime
- `logs/*.log` - Application logs
- `coverage/` - Test coverage reports

### Docker
- Docker images for backend and frontend
- Docker volumes for persistent data

This structure represents a complete, production-ready application with clean organization, comprehensive documentation, and professional development practices.
