# Quick Start Guide

Get L.I.N.D.A up and running in 5 minutes.

## Prerequisites

- Docker and Docker Compose installed
- Reddit API credentials (get them at https://www.reddit.com/prefs/apps)

## Step 1: Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd L.I.N.D.A

# Create environment file
cp .env.example .env

# Edit .env with your Reddit API credentials
nano .env  # or use your preferred editor
```

Required Reddit API values in `.env`:
```env
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_USER_AGENT=LINDA/1.0 by YourRedditUsername
```

## Step 2: Start the Application

```bash
# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be healthy (30-60 seconds)
docker-compose ps
```

## Step 3: Initialize Database

```bash
# Run database migrations
docker-compose exec backend npm run migration:run

# Seed initial data (adds top finance Reddit accounts)
docker-compose exec backend npm run seed
```

## Step 4: Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Step 5: Create Your Account

1. Open http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create your account with email and password
4. You'll be redirected to the dashboard

## Step 6: Trigger Initial Sync

The background jobs will automatically sync posts every 10 minutes, but you can trigger an immediate sync:

### Option A: Via API Documentation
1. Go to http://localhost:3001/api/docs
2. Click "Authorize" and enter your JWT token
3. Find `POST /reddit/sync-all` endpoint
4. Click "Try it out" and "Execute"

### Option B: Via Command Line
```bash
# Get your auth token first by logging in
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Use the accessToken from response
curl -X POST http://localhost:3001/reddit/sync-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## What Happens Next

1. **Post Ingestion** (10 min intervals):
   - System fetches latest posts from tracked Reddit accounts
   - Posts are stored in the database

2. **Analysis** (5 min intervals):
   - Sentiment analysis on new posts
   - Ticker and sector extraction
   - Theme and macro signal detection

3. **Strategy Generation** (hourly):
   - Aggregates analysis results
   - Identifies consensus signals
   - Generates investment strategy report

## Exploring the Dashboard

### Main Dashboard
- View sentiment overview
- See trending tickers
- Browse top engaging posts
- Check current strategy summary

### Analysis Page
- Deep dive into ticker trends
- Sector distribution charts
- Detailed ticker analysis table
- Custom time range filtering

### Strategy Page
- View current AI-generated strategy
- Bullish ideas and bearish risks
- Consensus signals across accounts
- Generate new strategies on demand

### Watchlists Page
- Create custom watchlists
- Track specific accounts and tickers
- Organize your research

## Customization

### Add More Reddit Accounts

1. Go to API docs: http://localhost:3001/api/docs
2. Use `POST /reddit/accounts` endpoint
3. Add account with username and category

Example:
```json
{
  "username": "investing",
  "displayName": "r/investing",
  "category": "Investing",
  "isActive": true
}
```

### Adjust Sync Frequency

Edit `backend/src/modules/job/job.service.ts`:

```typescript
@Cron(CronExpression.EVERY_10_MINUTES)  // Change this
async scheduleSyncJob() {
  // ...
}
```

Available options:
- `EVERY_5_MINUTES`
- `EVERY_10_MINUTES`
- `EVERY_30_MINUTES`
- `EVERY_HOUR`

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Service Health
```bash
curl http://localhost:3001/health
```

### Monitor Background Jobs
Check the `job_logs` table in PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d linda -c "SELECT * FROM job_logs ORDER BY created_at DESC LIMIT 10;"
```

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database connection errors
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres
```

### Redis connection errors
```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Reddit API errors
- Verify your API credentials in `.env`
- Check rate limits: Reddit allows 60 requests per minute
- Ensure your Reddit account is in good standing

### No posts appearing
- Wait for the first sync job (runs every 10 minutes)
- Or trigger manual sync via API
- Check job logs for errors

## Next Steps

1. **Customize tracked accounts**: Add/remove Reddit accounts based on your interests
2. **Create watchlists**: Organize accounts and tickers you want to monitor
3. **Explore analysis**: Use filters to find specific insights
4. **Generate strategies**: Create custom strategy reports for different time periods
5. **Set up alerts**: Extend the system to send notifications for high-conviction signals

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data structure
- Consult [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Development Mode

If you want to develop locally without Docker:

1. Start PostgreSQL and Redis:
```bash
docker-compose up -d postgres redis
```

2. Install dependencies and start backend:
```bash
cd backend
npm install
npm run migration:run
npm run seed
npm run start:dev
```

3. Install dependencies and start frontend:
```bash
cd frontend
npm install
npm run dev
```

## Performance Tips

1. **Increase sync frequency** for more real-time data
2. **Add more accounts** for broader market coverage
3. **Use filters** to focus on specific tickers or sectors
4. **Create watchlists** for organized tracking
5. **Monitor job logs** to ensure smooth operation

Enjoy using L.I.N.D.A!
