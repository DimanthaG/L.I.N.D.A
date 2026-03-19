# API Endpoints Reference

Base URL: `http://localhost:3001`

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "user"
}
```

## Reddit Accounts

### List Accounts
```http
GET /reddit/accounts?active=true
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "uuid",
    "username": "wallstreetbets",
    "displayName": "WallStreetBets",
    "followersCount": 15000000,
    "category": "Community",
    "isActive": true,
    "lastSyncedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Account Details
```http
GET /reddit/accounts/{id}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "username": "wallstreetbets",
  "displayName": "WallStreetBets",
  "description": "Like 4chan found a Bloomberg Terminal",
  "followersCount": 15000000,
  "isVerified": false,
  "category": "Community",
  "isActive": true
}
```

### Add Account
```http
POST /reddit/accounts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "username": "investing",
  "displayName": "r/investing",
  "category": "Investing",
  "isActive": true
}

Response: 201 Created
{
  "id": "uuid",
  "username": "investing",
  ...
}
```

### Sync Account
```http
POST /reddit/accounts/{id}/sync
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Sync completed",
  "newPosts": 15
}
```

### Sync All Accounts
```http
POST /reddit/sync-all
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "total": 8,
  "synced": 7,
  "failed": 1
}
```

### Delete Account
```http
DELETE /reddit/accounts/{id}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Account removed successfully"
}
```

## Posts

### List Posts
```http
GET /posts?limit=50&offset=0&sentiment=bullish&tickers=AAPL,TSLA
Authorization: Bearer {accessToken}

Query Parameters:
- accountIds: comma-separated account IDs
- startDate: ISO date string
- endDate: ISO date string
- sentiment: bullish|bearish|neutral
- tickers: comma-separated ticker symbols
- limit: number (default 50)
- offset: number (default 0)

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "content": "Post content...",
      "postedAt": "2024-01-15T10:00:00Z",
      "upvotes": 1500,
      "commentsCount": 250,
      "account": { ... },
      "analysis": { ... }
    }
  ],
  "total": 1000,
  "limit": 50,
  "offset": 0
}
```

### Get Top Posts
```http
GET /posts/top?days=7&limit=20
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "uuid",
    "content": "...",
    "engagementScore": 5000,
    ...
  }
]
```

### Get Post Details
```http
GET /posts/{id}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "content": "...",
  "account": { ... },
  "analysis": { ... },
  "tickerMentions": [ ... ]
}
```

### Get Posts by Account
```http
GET /posts/account/{accountId}?limit=50
Authorization: Bearer {accessToken}

Response: 200 OK
[
  { ... }
]
```

## Analysis

### Get Sentiment Trends
```http
GET /analysis/sentiment?days=7
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "sentiment": "bullish",
    "count": "450",
    "avgScore": "0.6523"
  },
  {
    "sentiment": "bearish",
    "count": "120",
    "avgScore": "-0.4231"
  }
]
```

### Get Trending Tickers
```http
GET /analysis/tickers?days=7&limit=20
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "ticker": "AAPL",
    "mentionCount": "85",
    "postCount": "42",
    "avgSentiment": "0.7234"
  }
]
```

### Get Sector Distribution
```http
GET /analysis/sectors?days=7
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "sector": "Technology",
    "count": 245
  },
  {
    "sector": "Financial Services",
    "count": 128
  }
]
```

### Get Trending Themes
```http
GET /analysis/themes?days=7&limit=15
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "theme": "AI/Tech",
    "count": 156
  },
  {
    "theme": "Interest Rates",
    "count": 89
  }
]
```

## Strategy

### Get Current Strategy
```http
GET /strategy/current
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "title": "Investment Strategy - 01/15/2024",
  "summary": "Current market sentiment shows bullish momentum...",
  "bullishIdeas": [
    {
      "ticker": "AAPL",
      "mentions": 85,
      "avgSentiment": 0.72,
      "topInsights": [...]
    }
  ],
  "bearishRisks": [...],
  "trendingOpportunities": [...],
  "consensusSignals": [...],
  "confidenceScore": 0.78,
  "timePeriod": "7 days",
  "postCount": 450,
  "accountCount": 8,
  "generatedAt": "2024-01-15T12:00:00Z"
}
```

### Get Strategy History
```http
GET /strategy/history?limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Investment Strategy - 01/15/2024",
    "summary": "...",
    "confidenceScore": 0.78,
    "generatedAt": "2024-01-15T12:00:00Z"
  }
]
```

### Generate Strategy
```http
POST /strategy/generate?days=7
Authorization: Bearer {accessToken}

Response: 201 Created
{
  "id": "uuid",
  "title": "Investment Strategy - 01/15/2024",
  ...
}
```

### Save Strategy
```http
POST /strategy/save/{strategyId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "notes": "Interesting tech plays for Q1"
}

Response: 201 Created
{
  "id": "uuid",
  "userId": "uuid",
  "strategyId": "uuid",
  "notes": "...",
  "savedAt": "2024-01-15T14:00:00Z"
}
```

### Get Saved Strategies
```http
GET /strategy/saved
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "uuid",
    "strategy": { ... },
    "notes": "...",
    "savedAt": "2024-01-15T14:00:00Z"
  }
]
```

## Watchlists

### List Watchlists
```http
GET /watchlists
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Tech Stocks",
    "description": "My tech watchlist",
    "isDefault": false,
    "accounts": [...],
    "tickers": [...]
  }
]
```

### Get Watchlist
```http
GET /watchlists/{id}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "name": "Tech Stocks",
  "accounts": [...],
  "tickers": [...]
}
```

### Create Watchlist
```http
POST /watchlists
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Tech Stocks",
  "description": "Technology sector watchlist",
  "isDefault": false,
  "accountIds": ["uuid1", "uuid2"],
  "tickers": ["AAPL", "MSFT", "GOOGL"]
}

Response: 201 Created
{
  "id": "uuid",
  "name": "Tech Stocks",
  ...
}
```

### Update Watchlist
```http
PUT /watchlists/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: 200 OK
{
  "id": "uuid",
  "name": "Updated Name",
  ...
}
```

### Delete Watchlist
```http
DELETE /watchlists/{id}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Watchlist deleted successfully"
}
```

### Add Ticker to Watchlist
```http
POST /watchlists/{id}/tickers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "ticker": "AAPL",
  "notes": "Watching for Q4 earnings"
}

Response: 201 Created
{
  "id": "uuid",
  "ticker": "AAPL",
  "notes": "...",
  "addedAt": "2024-01-15T15:00:00Z"
}
```

### Remove Ticker from Watchlist
```http
DELETE /watchlists/{id}/tickers/{ticker}
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Ticker removed successfully"
}
```

## Health Check

### Service Health
```http
GET /health

Response: 200 OK
{
  "status": "ok",
  "timestamp": "2024-01-15T16:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

- Default: 100 requests per minute per IP
- Authenticated: 1000 requests per minute per user
- Reddit sync: Limited by Reddit API (60 req/min)

## Pagination

Most list endpoints support pagination:

```http
GET /posts?limit=50&offset=0
```

Response includes:
```json
{
  "data": [...],
  "total": 1000,
  "limit": 50,
  "offset": 0
}
```

## Filtering

Posts and analysis endpoints support multiple filters:

```http
GET /posts?accountIds=uuid1,uuid2&sentiment=bullish&tickers=AAPL,TSLA&startDate=2024-01-01&endDate=2024-01-15
```

## Interactive Documentation

Full interactive API documentation with request/response examples:

http://localhost:3001/api/docs

Features:
- Try out endpoints directly
- View request/response schemas
- Authentication support
- Example values
- Error responses
