# Getting Started with L.I.N.D.A

Complete guide to get L.I.N.D.A running on your machine.

## What You'll Need

### Required
- **Docker Desktop** (recommended) OR Node.js 20+
- **Reddit API Credentials** (free, takes 2 minutes)
- **10 GB disk space**
- **4 GB RAM minimum**

### Optional
- Git (for version control)
- PostgreSQL client (for database access)
- Redis CLI (for cache inspection)

## Step-by-Step Setup

### Part 1: Get Reddit API Credentials (2 minutes)

1. Go to https://www.reddit.com/prefs/apps
2. Scroll to bottom and click "create another app..."
3. Fill in the form:
   - **Name**: L.I.N.D.A
   - **Type**: Select "script"
   - **Description**: Investment analysis tool
   - **About URL**: Leave blank
   - **Redirect URI**: http://localhost:3001/auth/reddit/callback
4. Click "create app"
5. Copy the values:
   - **Client ID**: The string under "personal use script"
   - **Client Secret**: The "secret" value

### Part 2: Set Up the Project (3 minutes)

#### Option A: Using Docker (Recommended)

```bash
# 1. Navigate to project directory
cd L.I.N.D.A

# 2. Create environment file
cp .env.example .env

# 3. Edit .env and add your Reddit credentials
nano .env  # or use any text editor

# Required values to update:
# REDDIT_CLIENT_ID=paste-your-client-id-here
# REDDIT_CLIENT_SECRET=paste-your-client-secret-here
# REDDIT_USER_AGENT=LINDA/1.0 by YourRedditUsername

# 4. Start all services
docker-compose up -d

# 5. Wait for services to start (check status)
docker-compose ps

# 6. Run database migrations
docker-compose exec backend npm run migration:run

# 7. Seed initial data (adds top finance accounts)
docker-compose exec backend npm run seed
```

#### Option B: Local Development (Without Docker)

```bash
# 1. Start PostgreSQL and Redis
# (Install via Homebrew on Mac, apt on Linux, or use Docker for just these)
docker-compose up -d postgres redis

# 2. Set up backend
cd backend
cp .env.example .env
# Edit .env with your Reddit credentials
npm install
npm run migration:run
npm run seed

# 3. Set up frontend
cd ../frontend
cp .env.example .env.local
npm install

# 4. Start backend (in terminal 1)
cd backend
npm run start:dev

# 5. Start frontend (in terminal 2)
cd frontend
npm run dev
```

### Part 3: Access the Application (1 minute)

1. **Open your browser** to http://localhost:3000
2. **Click "Get Started"** to create an account
3. **Fill in your details**:
   - Email: your-email@example.com
   - Password: (minimum 8 characters)
   - First/Last name (optional)
4. **Click "Create Account"**

You'll be automatically logged in and redirected to the dashboard!

### Part 4: Initial Data Sync (5 minutes)

The system will automatically sync posts every 10 minutes, but let's trigger an immediate sync:

#### Method 1: Via API Documentation (Easiest)

1. Go to http://localhost:3001/api/docs
2. Click the **"Authorize"** button at the top
3. Enter your JWT token:
   - Go back to the app (http://localhost:3000)
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Copy the `accessToken` value
   - Paste it in the "Authorize" dialog
4. Find **"POST /reddit/sync-all"** under the Reddit section
5. Click **"Try it out"** then **"Execute"**
6. Wait 1-2 minutes for sync to complete

#### Method 2: Via Command Line

```bash
# First, get your access token by logging in
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Trigger sync
curl -X POST http://localhost:3001/reddit/sync-all \
  -H "Authorization: Bearer $TOKEN"
```

### Part 5: Explore the Dashboard

#### Main Dashboard
- **Sentiment Overview**: See bullish/bearish/neutral distribution
- **Trending Tickers**: Top mentioned stock symbols
- **Trending Themes**: Popular investment topics
- **Top Posts**: Highest engagement posts

#### Analysis Page
- **Ticker Charts**: Visual representation of mentions
- **Sector Distribution**: Which sectors are hot
- **Detailed Table**: Full ticker analysis with sentiment

#### Strategy Page
- **Current Strategy**: AI-generated investment insights
- **Bullish Ideas**: Stocks with positive sentiment
- **Bearish Risks**: Potential concerns
- **Consensus Signals**: Tickers mentioned by multiple accounts

#### Watchlists Page
- **Create Watchlists**: Organize your research
- **Track Tickers**: Monitor specific stocks
- **Track Accounts**: Follow specific Reddit accounts

## Understanding the Data

### Sentiment Scores
- **Bullish** (> 0.15): Positive outlook, buying interest
- **Neutral** (-0.15 to 0.15): No clear direction
- **Bearish** (< -0.15): Negative outlook, selling interest

### Conviction Levels
- **High** (> 0.6): Strong conviction, actionable signals
- **Medium** (0.3-0.6): Moderate conviction
- **Low** (< 0.3): Weak conviction, noise

### Engagement Score
Calculated as: `(upvotes × 1) + (comments × 2) + (awards × 5)`

Higher engagement = more community interest

### Confidence Score
Strategy confidence based on:
- Number of bullish ideas (40%)
- Consensus signals (40%)
- Risk diversity (20%)

## Common Tasks

### Add a New Reddit Account

1. Go to API docs: http://localhost:3001/api/docs
2. Authorize with your token
3. Find **"POST /reddit/accounts"**
4. Click "Try it out"
5. Enter account details:
```json
{
  "username": "investing",
  "displayName": "r/investing",
  "category": "Investing",
  "isActive": true
}
```
6. Click "Execute"

### Generate a New Strategy

1. Go to Strategy page in the app
2. Click **"Generate New"** button
3. Wait 10-30 seconds for generation
4. View the updated strategy

### Create a Watchlist

1. Go to Watchlists page
2. Click **"New Watchlist"**
3. Enter a name (e.g., "Tech Stocks")
4. Click "Create"
5. Add tickers or accounts to it

### Filter Posts

1. Go to Dashboard
2. Use the time range selector (24H, 7D, 30D, 90D)
3. View updated data across all widgets

## Monitoring the System

### Check Service Health

```bash
# Via API
curl http://localhost:3001/health

# Via Docker
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Check Background Jobs

```bash
# View recent job logs
docker-compose exec postgres psql -U postgres -d linda -c \
  "SELECT job_name, status, started_at, completed_at 
   FROM job_logs 
   ORDER BY created_at DESC 
   LIMIT 10;"

# Check job queue status
docker-compose exec redis redis-cli KEYS "bull:*"
```

### Monitor Database

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d linda

# Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check post count
SELECT COUNT(*) FROM posts;

# Check analyzed posts
SELECT COUNT(*) FROM posts WHERE is_analyzed = true;
```

## Troubleshooting

### Issue: Services won't start

**Solution**:
```bash
# Check Docker is running
docker ps

# Restart services
docker-compose restart

# Check logs for errors
docker-compose logs
```

### Issue: Database connection failed

**Solution**:
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify credentials in .env
cat .env | grep DATABASE
```

### Issue: No posts appearing

**Possible causes**:
1. **Reddit API credentials invalid**: Check .env file
2. **First sync hasn't run yet**: Wait 10 minutes or trigger manual sync
3. **Rate limit reached**: Check `api_rate_limits` table

**Solution**:
```bash
# Trigger manual sync
curl -X POST http://localhost:3001/reddit/sync-all \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check job logs
docker-compose logs backend | grep "Sync"
```

### Issue: Analysis not running

**Solution**:
```bash
# Check Redis is running
docker-compose ps redis

# Check job queue
docker-compose exec redis redis-cli KEYS "bull:analysis:*"

# Check job logs
docker-compose exec postgres psql -U postgres -d linda -c \
  "SELECT * FROM job_logs WHERE job_name = 'analyze-posts' ORDER BY created_at DESC LIMIT 5;"
```

### Issue: Frontend can't connect to backend

**Solution**:
```bash
# Verify backend is running
curl http://localhost:3001/health

# Check NEXT_PUBLIC_API_URL in frontend/.env.local
cat frontend/.env.local | grep API_URL

# Restart frontend
docker-compose restart frontend
```

## Customization

### Change Sync Frequency

Edit `backend/src/modules/job/job.service.ts`:

```typescript
// Change from EVERY_10_MINUTES to EVERY_5_MINUTES
@Cron(CronExpression.EVERY_5_MINUTES)
async scheduleSyncJob() {
  // ...
}
```

### Add Custom Themes

Edit `backend/src/modules/analysis/theme.service.ts`:

```typescript
private readonly themeKeywords = {
  'Your Theme': ['keyword1', 'keyword2', 'keyword3'],
  // ... existing themes
};
```

### Customize Dashboard Colors

Edit `frontend/tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#your-color',
    // ...
  },
}
```

## Next Steps

### Learn the System
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Review [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API reference
3. Check [FEATURES.md](./FEATURES.md) for feature details

### Customize Your Setup
1. Add more Reddit accounts
2. Create watchlists for your interests
3. Adjust sync frequency
4. Customize themes and keywords

### Deploy to Production
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Set up production infrastructure
3. Configure SSL/TLS
4. Set up monitoring

### Extend the Application
1. Review [MODULE_DESIGN.md](./MODULE_DESIGN.md)
2. Add new analysis features
3. Integrate additional data sources
4. Build custom visualizations

## Getting Help

### Documentation
- **Quick Setup**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Guide**: [README.md](./README.md)
- **API Reference**: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Testing**: [TESTING.md](./TESTING.md)

### Debugging
1. Check logs: `docker-compose logs -f`
2. Check health: `curl http://localhost:3001/health`
3. Check database: Connect with psql
4. Check Redis: `docker-compose exec redis redis-cli ping`

### Common Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Access database
docker-compose exec postgres psql -U postgres -d linda

# Access Redis
docker-compose exec redis redis-cli

# Run migrations
docker-compose exec backend npm run migration:run

# Trigger sync
docker-compose exec backend npm run seed
```

## Success Checklist

- [ ] Docker services running
- [ ] Database migrated and seeded
- [ ] Frontend accessible at localhost:3000
- [ ] Backend accessible at localhost:3001
- [ ] API docs accessible at localhost:3001/api/docs
- [ ] User account created
- [ ] Initial sync completed
- [ ] Dashboard showing data
- [ ] Strategy generated

## What to Expect

### First 10 Minutes
- Services starting up
- Database initialization
- Initial data sync
- First analysis run

### First Hour
- Multiple sync cycles completed
- 100-500 posts ingested
- All posts analyzed
- First strategy generated

### First Day
- 1000+ posts collected
- Sentiment trends visible
- Ticker patterns emerging
- Multiple strategies generated

## Tips for Best Results

1. **Be Patient**: Initial sync takes a few minutes
2. **Check Logs**: Monitor progress in Docker logs
3. **Use Filters**: Focus on specific time ranges
4. **Create Watchlists**: Organize your research
5. **Generate Strategies**: Create custom reports
6. **Monitor Jobs**: Ensure background jobs are running

## Understanding the Flow

```
1. Reddit API → Fetch Posts → Store in Database
                                      ↓
2. Background Job → Analyze Posts → Extract Insights
                                      ↓
3. Strategy Engine → Generate Report → Display on Dashboard
                                      ↓
4. You → View Insights → Make Informed Decisions
```

## Your First Session

### Minute 1-2: Setup
- Start Docker services
- Run migrations
- Seed data

### Minute 3-5: Sync Data
- Trigger initial sync
- Wait for posts to be fetched
- Monitor progress in logs

### Minute 6-10: Explore
- Create your account
- Browse the dashboard
- Check trending tickers
- View sentiment trends

### Minute 11-15: Analyze
- Go to Analysis page
- Explore ticker details
- Check sector distribution
- Review themes

### Minute 16-20: Strategy
- Generate a strategy
- Review bullish ideas
- Check bearish risks
- Save the strategy

### Minute 21-30: Customize
- Create a watchlist
- Add favorite tickers
- Add favorite accounts
- Adjust time ranges

## Advanced Usage

### API Access

Once you're comfortable with the UI, you can access data programmatically:

```bash
# Get your token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}' \
  | jq -r '.accessToken')

# Get trending tickers
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/analysis/tickers?days=7&limit=20" | jq

# Get current strategy
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/strategy/current" | jq

# Get posts with filters
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/posts?sentiment=bullish&limit=10" | jq
```

### Database Queries

Connect to the database and run custom queries:

```bash
# Connect
docker-compose exec postgres psql -U postgres -d linda

# Get top tickers by mentions
SELECT 
  ticker,
  COUNT(*) as mentions,
  AVG(CASE WHEN sentiment = 'bullish' THEN 1 ELSE -1 END) as avg_sentiment
FROM ticker_mentions
WHERE mentioned_at > NOW() - INTERVAL '7 days'
GROUP BY ticker
ORDER BY mentions DESC
LIMIT 10;

# Get most active accounts
SELECT 
  ra.username,
  COUNT(p.id) as post_count,
  AVG(p.engagement_score) as avg_engagement
FROM reddit_accounts ra
JOIN posts p ON p.account_id = ra.id
WHERE p.posted_at > NOW() - INTERVAL '7 days'
GROUP BY ra.username
ORDER BY post_count DESC;
```

### Extending the System

#### Add Custom Analysis

1. Create new service in `backend/src/modules/analysis/`
2. Add analysis logic
3. Update AnalysisService to use it
4. Add endpoint in AnalysisController
5. Create frontend hook
6. Add UI component

#### Add New Data Source

1. Create new module (e.g., TwitterModule)
2. Implement API client
3. Create entities for data
4. Add to analysis pipeline
5. Update strategy generation

## Production Deployment

When you're ready to deploy:

1. **Read** [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Choose** deployment platform (AWS, GCP, Vercel, etc.)
3. **Configure** production environment variables
4. **Set up** production database and Redis
5. **Deploy** using Docker or platform-specific method
6. **Monitor** with health checks and logs

## Learning Resources

### Understanding the Code
- **Backend**: Start with `backend/src/app.module.ts`
- **Frontend**: Start with `frontend/src/app/page.tsx`
- **Entities**: Check `backend/src/entities/`
- **API Client**: See `frontend/src/lib/api-client.ts`

### Key Concepts
- **NestJS Modules**: Modular architecture pattern
- **TypeORM Entities**: Database models
- **React Query**: Server state management
- **BullMQ**: Job queue processing
- **JWT Auth**: Token-based authentication

## Community & Support

### Getting Help
1. Check documentation files
2. Review API documentation
3. Inspect logs for errors
4. Check GitHub issues

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit pull request

## Disclaimer

Remember: This application is for research and educational purposes. All insights are informational only and not financial advice. Always:
- Do your own research
- Consult financial advisors
- Understand investment risks
- Never invest more than you can afford to lose

## Congratulations!

You now have a fully functional investment analysis platform. Start exploring, create watchlists, and discover insights from Reddit's finance community!

Happy analyzing! 📈
