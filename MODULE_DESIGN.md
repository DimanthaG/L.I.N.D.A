# NestJS Module Design

## Module Architecture

L.I.N.D.A backend follows a modular architecture with clear separation of concerns.

## Core Modules

### 1. Auth Module
**Purpose**: Handle user authentication and authorization

**Components**:
- `AuthService`: User registration, login, token generation
- `AuthController`: Authentication endpoints
- `JwtStrategy`: JWT validation strategy
- `JwtAuthGuard`: Route protection guard
- `RolesGuard`: Role-based access control

**Dependencies**:
- `@nestjs/jwt`
- `@nestjs/passport`
- `passport-jwt`
- `bcrypt`

**Exports**:
- `AuthService`
- `JwtStrategy`
- `PassportModule`

### 2. User Module
**Purpose**: User profile management

**Components**:
- `UserService`: User CRUD operations
- `UserController`: User endpoints

**Dependencies**:
- `TypeOrmModule` (User entity)

**Exports**:
- `UserService`

### 3. Reddit Module
**Purpose**: Reddit API integration and post ingestion

**Components**:
- `RedditService`: Post synchronization orchestration
- `RedditApiService`: Reddit API client wrapper
- `RedditAccountService`: Account management
- `RedditController`: Reddit endpoints

**Key Features**:
- OAuth authentication with Reddit
- Rate limit tracking and handling
- Retry logic with exponential backoff
- Response caching
- Engagement score calculation

**Dependencies**:
- `@nestjs/axios`
- `TypeOrmModule` (RedditAccount, Post, ApiRateLimit)

**Exports**:
- `RedditService`
- `RedditApiService`
- `RedditAccountService`

### 4. Post Module
**Purpose**: Post retrieval and filtering

**Components**:
- `PostService`: Post queries and filtering
- `PostController`: Post endpoints

**Key Features**:
- Advanced filtering (account, date, sentiment, tickers)
- Pagination support
- Top posts by engagement
- Recent posts retrieval

**Dependencies**:
- `TypeOrmModule` (Post, PostAnalysis)

**Exports**:
- `PostService`

### 5. Analysis Module
**Purpose**: Content analysis and insight generation

**Components**:
- `AnalysisService`: Analysis orchestration and aggregation
- `SentimentService`: Sentiment and conviction analysis
- `TickerService`: Ticker extraction and sector mapping
- `ThemeService`: Theme and macro signal detection
- `AnalysisController`: Analysis endpoints

**Key Features**:
- Natural language sentiment analysis
- Ticker symbol extraction with validation
- Theme keyword matching
- Macro signal detection
- Actionability scoring
- Trend aggregation

**Dependencies**:
- `sentiment` library
- `natural` library
- `TypeOrmModule` (Post, PostAnalysis, TickerMention)

**Exports**:
- `AnalysisService`

### 6. Strategy Module
**Purpose**: Investment strategy generation

**Components**:
- `StrategyService`: Strategy generation and management
- `StrategyController`: Strategy endpoints

**Key Features**:
- Bullish idea aggregation
- Bearish risk identification
- Trending opportunity detection
- Consensus signal calculation
- Confidence scoring
- Strategy persistence

**Dependencies**:
- `TypeOrmModule` (Strategy, UserSavedStrategy, PostAnalysis, TickerMention, Post)

**Exports**:
- `StrategyService`

### 7. Watchlist Module
**Purpose**: User watchlist management

**Components**:
- `WatchlistService`: Watchlist CRUD operations
- `WatchlistController`: Watchlist endpoints

**Key Features**:
- Custom watchlist creation
- Account and ticker tracking
- Default watchlist support
- Bulk operations

**Dependencies**:
- `TypeOrmModule` (Watchlist, WatchlistTicker, RedditAccount)

**Exports**:
- `WatchlistService`

### 8. Job Module
**Purpose**: Background job processing

**Components**:
- `JobService`: Job scheduling and management
- `SyncProcessor`: Handles post synchronization jobs
- `AnalysisProcessor`: Handles post analysis jobs
- `StrategyProcessor`: Handles strategy generation jobs

**Key Features**:
- Scheduled cron jobs
- Job queue management with BullMQ
- Retry logic with backoff
- Job logging and monitoring
- Manual job triggering

**Dependencies**:
- `@nestjs/bull`
- `@nestjs/schedule`
- `BullModule` (sync, analysis, strategy queues)
- `RedditModule`, `AnalysisModule`, `StrategyModule`

**Job Schedule**:
- Sync: Every 10 minutes
- Analysis: Every 5 minutes
- Strategy: Every hour

**Exports**:
- `JobService`

## Common Modules

### Logger Module
**Purpose**: Centralized logging

**Components**:
- `LoggerService`: Winston-based logger

**Features**:
- Structured logging
- Daily log rotation
- Multiple log levels
- Context support
- Error stack traces

**Global**: Yes

### Cache Module
**Purpose**: Redis caching

**Components**:
- `CacheService`: Redis client wrapper

**Features**:
- Get/set/delete operations
- TTL support
- Pattern-based deletion
- Key existence checking

**Global**: Yes

### Health Module
**Purpose**: Service health monitoring

**Components**:
- `HealthController`: Health check endpoint

**Features**:
- Database connectivity check
- Redis connectivity check
- Service status reporting

## Module Dependencies Graph

```
AppModule
├── ConfigModule (Global)
├── TypeOrmModule (Global)
├── BullModule (Global)
├── ScheduleModule (Global)
├── LoggerModule (Global)
├── CacheModule (Global)
├── HealthModule
├── AuthModule
│   └── TypeOrmModule.forFeature([User])
├── UserModule
│   └── TypeOrmModule.forFeature([User])
├── RedditModule
│   ├── TypeOrmModule.forFeature([RedditAccount, Post, ApiRateLimit])
│   └── HttpModule
├── PostModule
│   └── TypeOrmModule.forFeature([Post, PostAnalysis])
├── AnalysisModule
│   └── TypeOrmModule.forFeature([Post, PostAnalysis, TickerMention])
├── StrategyModule
│   └── TypeOrmModule.forFeature([Strategy, UserSavedStrategy, PostAnalysis, TickerMention, Post])
├── WatchlistModule
│   └── TypeOrmModule.forFeature([Watchlist, WatchlistTicker, RedditAccount])
└── JobModule
    ├── TypeOrmModule.forFeature([JobLog])
    ├── BullModule.registerQueue([sync, analysis, strategy])
    ├── RedditModule
    ├── AnalysisModule
    └── StrategyModule
```

## Data Flow Between Modules

### Ingestion Flow
```
RedditModule (API) → Post Entity → Database
                                      ↓
                              JobModule (Analysis Queue)
                                      ↓
                              AnalysisModule
                                      ↓
                    PostAnalysis + TickerMention Entities
                                      ↓
                              JobModule (Strategy Queue)
                                      ↓
                              StrategyModule
                                      ↓
                              Strategy Entity
```

### Query Flow
```
Frontend → PostController → PostService → Database
Frontend → AnalysisController → AnalysisService → Database + Cache
Frontend → StrategyController → StrategyService → Database + Cache
```

## Service Responsibilities

### RedditService
- Orchestrate post synchronization
- Calculate engagement scores
- Extract media URLs
- Coordinate with RedditApiService and RedditAccountService

### RedditApiService
- Authenticate with Reddit OAuth
- Make API requests with retry logic
- Handle rate limiting
- Cache responses
- Track API usage

### RedditAccountService
- CRUD operations for Reddit accounts
- Track sync timestamps
- Filter active accounts

### AnalysisService
- Orchestrate post analysis
- Batch process unanalyzed posts
- Aggregate analysis results
- Generate trend reports
- Cache analysis results

### SentimentService
- Analyze text sentiment
- Calculate sentiment scores
- Determine conviction levels
- Detect conviction signals

### TickerService
- Extract ticker symbols
- Validate tickers
- Map tickers to sectors
- Extract context

### ThemeService
- Detect investment themes
- Identify macro signals
- Extract key phrases
- Score actionability

### StrategyService
- Generate investment strategies
- Detect consensus
- Aggregate bullish/bearish signals
- Calculate confidence scores
- Manage saved strategies

### WatchlistService
- CRUD operations for watchlists
- Manage watchlist accounts
- Manage watchlist tickers
- Handle default watchlists

### JobService
- Schedule cron jobs
- Manage job queues
- Log job execution
- Trigger manual jobs

## Best Practices

### 1. Dependency Injection
All services use constructor injection for dependencies:
```typescript
constructor(
  @InjectRepository(Entity)
  private repository: Repository<Entity>,
  private otherService: OtherService,
) {}
```

### 2. Error Handling
Services throw appropriate HTTP exceptions:
```typescript
throw new NotFoundException('Resource not found');
throw new UnauthorizedException('Invalid credentials');
throw new ConflictException('Resource already exists');
```

### 3. Logging
All services log important operations:
```typescript
this.logger.log('Operation completed', 'ServiceName');
this.logger.error('Operation failed', error.stack, 'ServiceName');
```

### 4. Caching
Services cache expensive operations:
```typescript
const cached = await this.cacheService.get(key);
if (cached) return cached;
// ... compute result
await this.cacheService.set(key, result, ttlSeconds);
```

### 5. Validation
All DTOs use class-validator:
```typescript
export class CreateDto {
  @IsString()
  @MaxLength(100)
  name: string;
}
```

### 6. Documentation
All endpoints have Swagger documentation:
```typescript
@ApiOperation({ summary: 'Endpoint description' })
@ApiResponse({ status: 200, description: 'Success' })
```

## Testing Strategy

### Unit Tests
- Test individual services in isolation
- Mock dependencies
- Test business logic

### Integration Tests
- Test controller + service integration
- Use test database
- Test API endpoints

### E2E Tests
- Test complete user flows
- Test authentication
- Test data pipeline

## Performance Considerations

### Database Queries
- Use indexes for frequently queried columns
- Implement pagination
- Use select queries to limit data
- Avoid N+1 queries with proper joins

### Caching Strategy
- Cache expensive aggregations (1 hour TTL)
- Cache API responses (15-30 min TTL)
- Cache strategy reports (30 min TTL)
- Invalidate cache on updates

### Background Jobs
- Process in batches
- Use job priorities
- Implement concurrency limits
- Monitor queue size

## Security Measures

### Authentication
- JWT with short expiration (1 hour)
- Refresh tokens for extended sessions
- Secure password hashing (bcrypt)

### Authorization
- Role-based access control
- Route guards on protected endpoints
- User context in requests

### Input Validation
- DTO validation on all inputs
- Whitelist unknown properties
- Transform and sanitize inputs

### API Security
- CORS configuration
- Rate limiting
- Request logging
- Error message sanitization
