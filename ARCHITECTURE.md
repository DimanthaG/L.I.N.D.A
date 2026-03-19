# L.I.N.D.A - Architecture Overview

**L**everaged **I**nvestment **N**arrative **D**iscovery & **A**nalysis

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │  Watchlists  │  │   Strategy   │     │
│  │    Pages     │  │    Pages     │  │    Pages     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │         React Components & State Management        │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     NestJS Backend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │   Reddit     │  │   Analysis   │     │
│  │   Module     │  │   Module     │  │   Module     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Strategy    │  │  Watchlist   │  │   User       │     │
│  │   Module     │  │   Module     │  │   Module     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │    Redis     │    │   BullMQ     │
│   Database   │    │    Cache     │    │  Job Queue   │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Reddit API  │
                    └──────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Charts**: Recharts / Chart.js
- **Auth**: NextAuth.js

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM
- **Cache**: Redis
- **Job Queue**: BullMQ
- **Auth**: Passport JWT
- **Validation**: class-validator

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Process Management**: PM2 (production)
- **Logging**: Winston
- **API Documentation**: Swagger/OpenAPI

## Core Modules

### 1. Authentication Module
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Token refresh mechanism
- Role-based access control (RBAC)

### 2. Reddit Module
- Reddit API client wrapper
- Rate limiting and retry logic
- Post ingestion service
- Account tracking
- Engagement metrics collection
- Webhook support for real-time updates

### 3. Analysis Module
- Sentiment analysis (positive/negative/neutral)
- Ticker extraction (regex + NLP)
- Sector classification
- Theme detection (keywords, topics)
- Conviction scoring
- Macro signal identification

### 4. Strategy Module
- Consensus detection across accounts
- Bullish/bearish idea aggregation
- Trending opportunity identification
- Confidence score calculation
- Strategy report generation

### 5. Watchlist Module
- User-specific account watchlists
- Custom ticker tracking
- Alert configuration
- Saved searches

### 6. User Module
- User profile management
- Preferences and settings
- Subscription management

## Data Flow

### Ingestion Pipeline
```
Reddit API → Ingestion Service → Raw Posts (DB)
                ↓
         Analysis Queue (BullMQ)
                ↓
         Analysis Service
                ↓
    ┌───────────┴───────────┐
    ▼                       ▼
Sentiment/Tickers      Strategy Engine
    ↓                       ↓
Analysis Results (DB)  Strategy Reports (DB)
    ↓                       ↓
         Cache (Redis)
                ↓
         API Response
                ↓
         Frontend Dashboard
```

### Background Jobs
1. **Scheduled Sync Job**: Runs every 15 minutes to fetch new posts
2. **Analysis Job**: Processes unanalyzed posts
3. **Strategy Generation Job**: Runs hourly to update strategy reports
4. **Cache Warming Job**: Pre-loads frequently accessed data
5. **Cleanup Job**: Archives old data daily

## API Design

### REST Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

#### Reddit Accounts
- `GET /reddit/accounts` - List tracked accounts
- `POST /reddit/accounts` - Add account to tracking
- `DELETE /reddit/accounts/:id` - Remove account
- `GET /reddit/accounts/:id/posts` - Get posts from account

#### Posts
- `GET /posts` - List posts with filters
- `GET /posts/:id` - Get post details
- `GET /posts/:id/analysis` - Get post analysis

#### Analysis
- `GET /analysis/sentiment` - Sentiment trends
- `GET /analysis/tickers` - Ticker mentions and trends
- `GET /analysis/sectors` - Sector distribution
- `GET /analysis/themes` - Trending themes

#### Strategy
- `GET /strategy/current` - Current strategy report
- `GET /strategy/history` - Historical strategies
- `POST /strategy/generate` - Trigger strategy generation

#### Watchlists
- `GET /watchlists` - User watchlists
- `POST /watchlists` - Create watchlist
- `PUT /watchlists/:id` - Update watchlist
- `DELETE /watchlists/:id` - Delete watchlist

## Security Considerations

1. **API Keys**: Store Reddit API credentials in environment variables
2. **Rate Limiting**: Implement rate limiting on all endpoints
3. **Input Validation**: Validate all user inputs
4. **SQL Injection**: Use parameterized queries (TypeORM)
5. **XSS Protection**: Sanitize user-generated content
6. **CORS**: Configure appropriate CORS policies
7. **Secrets Management**: Use environment variables, never commit secrets

## Performance Optimization

1. **Caching Strategy**:
   - Cache Reddit API responses (15 min TTL)
   - Cache analysis results (1 hour TTL)
   - Cache strategy reports (30 min TTL)

2. **Database Indexing**:
   - Index on post timestamps
   - Index on ticker symbols
   - Index on account IDs
   - Composite indexes for common queries

3. **Query Optimization**:
   - Use pagination for large result sets
   - Implement cursor-based pagination
   - Use database views for complex aggregations

4. **Background Processing**:
   - Offload heavy analysis to background jobs
   - Use job priorities and concurrency limits

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API design allows multiple instances
2. **Database Connection Pooling**: Configure appropriate pool sizes
3. **Redis Clustering**: Support Redis cluster for high availability
4. **Job Queue Distribution**: Multiple workers for job processing
5. **CDN**: Serve static assets via CDN

## Monitoring & Observability

1. **Logging**: Structured logging with Winston
2. **Metrics**: Track API response times, job processing times
3. **Health Checks**: `/health` endpoint for service monitoring
4. **Error Tracking**: Centralized error logging
5. **Audit Logs**: Track user actions and API calls

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer (Nginx)                    │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌──────────────────┐              ┌──────────────────┐
│  Next.js (SSR)   │              │  NestJS API      │
│  Container(s)    │              │  Container(s)    │
└──────────────────┘              └──────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────┐
         ▼                                 ▼             ▼
┌──────────────────┐    ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │    │      Redis       │  │  BullMQ Worker   │
│   (Primary)      │    │   (Cache/Queue)  │  │   Container(s)   │
└──────────────────┘    └──────────────────┘  └──────────────────┘
```

## Development Workflow

1. **Local Development**: Docker Compose for all services
2. **Testing**: Jest for unit tests, Supertest for integration tests
3. **CI/CD**: GitHub Actions for automated testing and deployment
4. **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## Disclaimer

This application provides research and analysis tools for educational purposes. All insights generated are for informational use only and should not be construed as financial advice. Users should conduct their own research and consult with financial advisors before making investment decisions.
