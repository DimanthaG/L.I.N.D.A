# L.I.N.D.A

**L**everaged **I**nvestment **N**arrative **D**iscovery & **A**nalysis

A production-ready full-stack web application that connects to the Reddit API to analyze posts from curated finance and investing accounts, providing actionable investment insights through sentiment analysis, ticker tracking, and AI-generated strategy reports.

## Features

### Core Functionality
- **Reddit Integration**: Automated ingestion of posts from top finance accounts
- **Sentiment Analysis**: Real-time sentiment scoring (bullish/bearish/neutral)
- **Ticker Extraction**: Automatic detection and tracking of stock mentions
- **Theme Detection**: Identify trending investment themes and macro signals
- **Strategy Generation**: AI-powered investment strategy reports with confidence scoring
- **Consensus Detection**: Identify tickers mentioned by multiple accounts
- **User Watchlists**: Custom tracking of accounts and tickers
- **Background Jobs**: Scheduled sync and analysis with BullMQ

### Dashboard Features
- Real-time sentiment overview with charts
- Trending tickers and sector distribution
- Top engaging posts feed
- Theme cloud visualization
- Historical analysis and trends
- Custom time range filtering

## Technology Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Job Queue**: BullMQ
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Charts**: Recharts
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Logging**: Winston

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Reddit API credentials

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd L.I.N.D.A
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the application with Docker:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec backend npm run migration:run
```

5. Seed initial data:
```bash
docker-compose exec backend npm run seed
```

6. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

### Local Development (without Docker)

1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Start PostgreSQL and Redis locally or via Docker:
```bash
docker-compose up -d postgres redis
```

3. Configure environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

4. Run migrations and seed:
```bash
cd backend
npm run migration:run
npm run seed
```

5. Start development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Project Structure

```
L.I.N.D.A/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── entities/          # TypeORM entities
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── user/         # User management
│   │   │   ├── reddit/       # Reddit API integration
│   │   │   ├── post/         # Post management
│   │   │   ├── analysis/     # Analysis engine
│   │   │   ├── strategy/     # Strategy generation
│   │   │   ├── watchlist/    # Watchlist management
│   │   │   └── job/          # Background jobs
│   │   ├── common/           # Shared utilities
│   │   ├── migrations/       # Database migrations
│   │   └── main.ts           # Application entry
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── store/            # State management
│   ├── Dockerfile
│   └── package.json
├── nginx/                      # Nginx configuration
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose
├── ARCHITECTURE.md             # Architecture documentation
├── DATABASE_SCHEMA.md          # Database schema
└── IMPLEMENTATION_PLAN.md      # Implementation guide
```

## API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation.

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

#### Reddit
- `GET /reddit/accounts` - List tracked accounts
- `POST /reddit/accounts` - Add account to tracking
- `POST /reddit/sync-all` - Sync all accounts

#### Analysis
- `GET /analysis/sentiment` - Sentiment trends
- `GET /analysis/tickers` - Trending tickers
- `GET /analysis/sectors` - Sector distribution
- `GET /analysis/themes` - Trending themes

#### Strategy
- `GET /strategy/current` - Current strategy report
- `POST /strategy/generate` - Generate new strategy
- `GET /strategy/history` - Strategy history

#### Posts
- `GET /posts` - List posts with filters
- `GET /posts/top` - Top engaging posts

#### Watchlists
- `GET /watchlists` - User watchlists
- `POST /watchlists` - Create watchlist

## Background Jobs

The application runs several background jobs:

1. **Sync Job** (every 10 minutes): Fetches new posts from Reddit
2. **Analysis Job** (every 5 minutes): Analyzes unprocessed posts
3. **Strategy Job** (every hour): Generates new strategy reports

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

Key tables:
- `users` - User accounts
- `reddit_accounts` - Tracked Reddit accounts
- `posts` - Reddit posts
- `post_analysis` - Analysis results
- `ticker_mentions` - Ticker tracking
- `strategies` - Generated strategies
- `watchlists` - User watchlists

## Configuration

### Reddit API Setup

1. Go to https://www.reddit.com/prefs/apps
2. Create a new application (script type)
3. Copy the client ID and secret
4. Add credentials to `.env` file

### Environment Variables

See `.env.example` for all required variables.

Critical variables:
- `REDDIT_CLIENT_ID` - Reddit API client ID
- `REDDIT_CLIENT_SECRET` - Reddit API secret
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `DATABASE_PASSWORD` - PostgreSQL password
- `REDIS_PASSWORD` - Redis password

## Production Deployment

### Using Docker Compose

1. Configure production environment:
```bash
cp .env.example .env
# Edit .env with production values
```

2. Build and start services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. Run migrations:
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

4. Seed initial data:
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### Manual Deployment

See individual README files in `backend/` and `frontend/` for manual deployment instructions.

## Security Considerations

1. **API Keys**: Never commit API keys or secrets to version control
2. **Environment Variables**: Use strong, unique values in production
3. **HTTPS**: Always use SSL/TLS in production
4. **Rate Limiting**: Configure appropriate rate limits
5. **Input Validation**: All inputs are validated with class-validator
6. **SQL Injection**: Protected via TypeORM parameterized queries
7. **CORS**: Configure allowed origins appropriately

## Performance Optimization

1. **Caching**: Redis caching for API responses (15-60 min TTL)
2. **Database Indexing**: Optimized indexes on frequently queried columns
3. **Connection Pooling**: Configured database connection pools
4. **Background Processing**: Heavy analysis offloaded to job queue
5. **Pagination**: Cursor-based pagination for large datasets

## Monitoring

### Health Checks
- Backend: http://localhost:3001/health
- Database: Check PostgreSQL connection
- Redis: Check Redis connection
- Job Queue: Monitor BullMQ dashboard

### Logs
- Backend logs: `backend/logs/`
- Application logs: Winston with daily rotation
- Job logs: Stored in `job_logs` table

## Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:cov
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_* environment variables
- Ensure migrations have been run

### Redis Connection Issues
- Verify Redis is running
- Check REDIS_* environment variables
- Test connection with `redis-cli ping`

### Reddit API Issues
- Verify API credentials are correct
- Check rate limits in `api_rate_limits` table
- Review logs for authentication errors

### Job Queue Issues
- Check Redis connection
- Monitor job logs in database
- Review BullMQ dashboard

## Contributing

1. Follow TypeScript best practices
2. Use ESLint and Prettier for code formatting
3. Write tests for new features
4. Update documentation as needed

## License

MIT

## Disclaimer

This application provides research and analysis tools for educational purposes. All insights generated are for informational use only and should not be construed as financial advice. Users should conduct their own research and consult with qualified financial advisors before making investment decisions.

## Support

For issues and questions, please open a GitHub issue.
