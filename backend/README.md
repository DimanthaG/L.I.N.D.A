# L.I.N.D.A Backend

**L**everaged **I**nvestment **N**arrative **D**iscovery & **A**nalysis - Backend API

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npm run migration:run
```

4. Seed initial data:
```bash
npm run seed
```

### Development

Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

API documentation: `http://localhost:3001/api/docs`

### Database Migrations

Generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

Run migrations:
```bash
npm run migration:run
```

Revert last migration:
```bash
npm run migration:revert
```

## Architecture

### Modules

- **Auth Module**: JWT authentication, user registration/login
- **User Module**: User profile management
- **Reddit Module**: Reddit API integration, account tracking, post ingestion
- **Post Module**: Post retrieval and filtering
- **Analysis Module**: Sentiment analysis, ticker extraction, theme detection
- **Strategy Module**: Investment strategy generation
- **Watchlist Module**: User watchlist management
- **Job Module**: Background job processing with BullMQ

### Background Jobs

- **Sync Job**: Runs every 10 minutes to fetch new posts
- **Analysis Job**: Runs every 5 minutes to analyze unprocessed posts
- **Strategy Job**: Runs every hour to generate strategy reports

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Reddit Accounts
- `GET /reddit/accounts` - List tracked accounts
- `POST /reddit/accounts` - Add account
- `DELETE /reddit/accounts/:id` - Remove account
- `POST /reddit/accounts/:id/sync` - Sync account posts

### Posts
- `GET /posts` - List posts with filters
- `GET /posts/top` - Get top engaging posts
- `GET /posts/:id` - Get post details
- `GET /posts/account/:accountId` - Get posts by account

### Analysis
- `GET /analysis/sentiment` - Sentiment trends
- `GET /analysis/tickers` - Trending tickers
- `GET /analysis/sectors` - Sector distribution
- `GET /analysis/themes` - Trending themes

### Strategy
- `GET /strategy/current` - Current strategy
- `GET /strategy/history` - Strategy history
- `POST /strategy/generate` - Generate new strategy
- `POST /strategy/save/:strategyId` - Save strategy
- `GET /strategy/saved` - User saved strategies

### Watchlists
- `GET /watchlists` - User watchlists
- `POST /watchlists` - Create watchlist
- `PUT /watchlists/:id` - Update watchlist
- `DELETE /watchlists/:id` - Delete watchlist
- `POST /watchlists/:id/tickers` - Add ticker
- `DELETE /watchlists/:id/tickers/:ticker` - Remove ticker

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

## Production Deployment

Build the application:
```bash
npm run build
```

Start production server:
```bash
npm run start:prod
```

## Environment Variables

See `.env.example` for required configuration.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `REDDIT_CLIENT_ID` - Reddit API client ID
- `REDDIT_CLIENT_SECRET` - Reddit API client secret
