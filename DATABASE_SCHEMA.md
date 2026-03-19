# Database Schema

## Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    users    │         │  watchlists │         │ reddit_     │
│             │◄────────│             │────────►│  accounts   │
│  - id       │  1:N    │  - id       │   N:M   │             │
│  - email    │         │  - user_id  │         │  - id       │
│  - password │         │  - name     │         │  - username │
│  - role     │         └─────────────┘         │  - platform │
└─────────────┘                                 │  - followers│
                                                 └─────────────┘
                                                       │ 1:N
                                                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  strategies │         │   posts     │         │  post_      │
│             │         │             │◄────────│  analysis   │
│  - id       │         │  - id       │   1:1   │             │
│  - report   │         │  - account  │         │  - post_id  │
│  - created  │         │  - content  │         │  - sentiment│
└─────────────┘         │  - timestamp│         │  - tickers  │
                        │  - metrics  │         │  - themes   │
                        └─────────────┘         └─────────────┘
```

## Tables

### users
Stores user account information and authentication credentials.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### reddit_accounts
Tracks Reddit accounts being monitored for finance content.

```sql
CREATE TABLE reddit_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  account_id VARCHAR(100),
  description TEXT,
  followers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reddit_accounts_username ON reddit_accounts(username);
CREATE INDEX idx_reddit_accounts_category ON reddit_accounts(category);
CREATE INDEX idx_reddit_accounts_active ON reddit_accounts(is_active);
```

### posts
Stores Reddit posts from tracked accounts.

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES reddit_accounts(id) ON DELETE CASCADE,
  post_id VARCHAR(100) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  posted_at TIMESTAMP NOT NULL,
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  awards_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(10, 2),
  url TEXT,
  media_urls TEXT[],
  is_analyzed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_account_id ON posts(account_id);
CREATE INDEX idx_posts_posted_at ON posts(posted_at DESC);
CREATE INDEX idx_posts_post_id ON posts(post_id);
CREATE INDEX idx_posts_is_analyzed ON posts(is_analyzed);
CREATE INDEX idx_posts_engagement ON posts(engagement_score DESC);
```

### post_analysis
Stores analysis results for each post.

```sql
CREATE TABLE post_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
  sentiment VARCHAR(50) NOT NULL,
  sentiment_score DECIMAL(5, 4),
  conviction_level VARCHAR(50),
  conviction_score DECIMAL(5, 4),
  tickers TEXT[],
  sectors TEXT[],
  themes TEXT[],
  macro_signals TEXT[],
  key_phrases TEXT[],
  is_actionable BOOLEAN DEFAULT false,
  analyzed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_analysis_post_id ON post_analysis(post_id);
CREATE INDEX idx_post_analysis_sentiment ON post_analysis(sentiment);
CREATE INDEX idx_post_analysis_tickers ON post_analysis USING GIN(tickers);
CREATE INDEX idx_post_analysis_sectors ON post_analysis USING GIN(sectors);
CREATE INDEX idx_post_analysis_analyzed_at ON post_analysis(analyzed_at DESC);
```

### ticker_mentions
Aggregates ticker mentions across posts for trend analysis.

```sql
CREATE TABLE ticker_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker VARCHAR(20) NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  mention_count INTEGER DEFAULT 1,
  context TEXT,
  sentiment VARCHAR(50),
  mentioned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ticker_mentions_ticker ON ticker_mentions(ticker);
CREATE INDEX idx_ticker_mentions_post_id ON ticker_mentions(post_id);
CREATE INDEX idx_ticker_mentions_mentioned_at ON ticker_mentions(mentioned_at DESC);
CREATE INDEX idx_ticker_mentions_ticker_date ON ticker_mentions(ticker, mentioned_at DESC);
```

### strategies
Stores generated investment strategy reports.

```sql
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  bullish_ideas JSONB,
  bearish_risks JSONB,
  trending_opportunities JSONB,
  consensus_signals JSONB,
  confidence_score DECIMAL(5, 4),
  time_period VARCHAR(50),
  post_count INTEGER,
  account_count INTEGER,
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_strategies_generated_at ON strategies(generated_at DESC);
CREATE INDEX idx_strategies_confidence ON strategies(confidence_score DESC);
```

### watchlists
User-created lists of accounts and tickers to monitor.

```sql
CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
```

### watchlist_accounts
Junction table for watchlist and Reddit accounts.

```sql
CREATE TABLE watchlist_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  account_id UUID REFERENCES reddit_accounts(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(watchlist_id, account_id)
);

CREATE INDEX idx_watchlist_accounts_watchlist ON watchlist_accounts(watchlist_id);
CREATE INDEX idx_watchlist_accounts_account ON watchlist_accounts(account_id);
```

### watchlist_tickers
User-tracked tickers within watchlists.

```sql
CREATE TABLE watchlist_tickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  ticker VARCHAR(20) NOT NULL,
  notes TEXT,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(watchlist_id, ticker)
);

CREATE INDEX idx_watchlist_tickers_watchlist ON watchlist_tickers(watchlist_id);
CREATE INDEX idx_watchlist_tickers_ticker ON watchlist_tickers(ticker);
```

### user_saved_strategies
Tracks strategies saved by users.

```sql
CREATE TABLE user_saved_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  notes TEXT,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, strategy_id)
);

CREATE INDEX idx_user_saved_strategies_user ON user_saved_strategies(user_id);
CREATE INDEX idx_user_saved_strategies_strategy ON user_saved_strategies(strategy_id);
```

### api_rate_limits
Tracks API usage for rate limiting.

```sql
CREATE TABLE api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255) NOT NULL,
  remaining_calls INTEGER,
  reset_at TIMESTAMP,
  last_called_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_rate_limits_endpoint ON api_rate_limits(endpoint);
```

### job_logs
Tracks background job execution.

```sql
CREATE TABLE job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR(255) NOT NULL,
  job_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_job_logs_job_name ON job_logs(job_name);
CREATE INDEX idx_job_logs_status ON job_logs(status);
CREATE INDEX idx_job_logs_created_at ON job_logs(created_at DESC);
```

## Data Types Reference

### Sentiment Values
- `bullish` - Positive outlook
- `bearish` - Negative outlook
- `neutral` - No clear direction

### Conviction Levels
- `high` - Strong conviction (score > 0.75)
- `medium` - Moderate conviction (score 0.5-0.75)
- `low` - Weak conviction (score < 0.5)

### User Roles
- `admin` - Full system access
- `user` - Standard user access
- `analyst` - Enhanced analysis features

### Job Status
- `pending` - Queued for processing
- `active` - Currently processing
- `completed` - Successfully completed
- `failed` - Failed with error
- `delayed` - Scheduled for future execution

## Sample Queries

### Get trending tickers in last 24 hours
```sql
SELECT 
  ticker,
  COUNT(*) as mention_count,
  AVG(CASE 
    WHEN sentiment = 'bullish' THEN 1 
    WHEN sentiment = 'bearish' THEN -1 
    ELSE 0 
  END) as avg_sentiment
FROM ticker_mentions
WHERE mentioned_at > NOW() - INTERVAL '24 hours'
GROUP BY ticker
ORDER BY mention_count DESC
LIMIT 20;
```

### Get most influential accounts by engagement
```sql
SELECT 
  ra.username,
  ra.display_name,
  COUNT(p.id) as post_count,
  AVG(p.engagement_score) as avg_engagement,
  SUM(p.upvotes) as total_upvotes
FROM reddit_accounts ra
JOIN posts p ON p.account_id = ra.id
WHERE p.posted_at > NOW() - INTERVAL '7 days'
GROUP BY ra.id, ra.username, ra.display_name
ORDER BY avg_engagement DESC
LIMIT 10;
```

### Get consensus bullish tickers
```sql
SELECT 
  tm.ticker,
  COUNT(DISTINCT p.account_id) as account_count,
  COUNT(*) as mention_count,
  AVG(pa.sentiment_score) as avg_sentiment
FROM ticker_mentions tm
JOIN posts p ON p.id = tm.post_id
JOIN post_analysis pa ON pa.post_id = p.id
WHERE 
  tm.mentioned_at > NOW() - INTERVAL '7 days'
  AND pa.sentiment = 'bullish'
GROUP BY tm.ticker
HAVING COUNT(DISTINCT p.account_id) >= 3
ORDER BY account_count DESC, avg_sentiment DESC;
```
