# Testing Guide

## Testing Strategy

L.I.N.D.A uses a comprehensive testing approach with unit, integration, and end-to-end tests.

## Backend Testing

### Setup

Tests use Jest as the testing framework with TypeScript support.

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run specific test file
npm test -- auth.service.spec.ts
```

### Unit Tests

Unit tests focus on individual services and their business logic.

#### Example: Testing AuthService

Create `backend/src/modules/auth/auth.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: 'LoggerService',
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ id: '1', email: 'test@test.com' });
      mockUserRepository.save.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await service.register({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if user exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          email: 'test@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow('User with this email already exists');
    });
  });
});
```

### Integration Tests

Integration tests verify that modules work together correctly.

#### Example: Testing Post Endpoints

Create `backend/test/post.e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('/posts/top (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts/top?days=7&limit=10')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

### Test Database Setup

Create a separate test database configuration:

```typescript
// backend/src/config/typeorm-test.config.ts
export const testTypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433, // Different port for test DB
  username: 'postgres',
  password: 'postgres',
  database: 'linda_test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Auto-sync for tests
  dropSchema: true, // Clean slate for each test run
};
```

## Frontend Testing

### Setup

Frontend tests use React Testing Library and Jest.

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Component Tests

#### Example: Testing PostFeed Component

Create `frontend/src/components/posts/PostFeed.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { PostFeed } from './PostFeed';

const mockPosts = [
  {
    id: '1',
    content: 'Test post content',
    postedAt: '2024-01-15T10:00:00Z',
    upvotes: 100,
    commentsCount: 20,
    awardsCount: 5,
    engagementScore: 250,
    account: {
      username: 'testuser',
      displayName: 'Test User',
    },
    analysis: {
      sentiment: 'bullish',
      tickers: ['AAPL', 'TSLA'],
      themes: ['AI/Tech'],
    },
  },
];

describe('PostFeed', () => {
  it('renders posts correctly', () => {
    render(<PostFeed posts={mockPosts} />);
    
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('$AAPL')).toBeInTheDocument();
  });

  it('shows empty state when no posts', () => {
    render(<PostFeed posts={[]} />);
    
    expect(screen.getByText('No posts available')).toBeInTheDocument();
  });
});
```

### Hook Tests

#### Example: Testing useAuth Hook

Create `frontend/src/hooks/useAuth.test.ts`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

## Test Coverage Goals

### Backend
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

### Frontend
- **Component Tests**: 70%+ coverage
- **Hook Tests**: 80%+ coverage
- **Integration Tests**: Key user flows

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern
```typescript
it('should do something', () => {
  // Arrange
  const input = 'test';
  
  // Act
  const result = service.doSomething(input);
  
  // Assert
  expect(result).toBe('expected');
});
```

### 2. Mock External Dependencies
```typescript
const mockHttpService = {
  get: jest.fn().mockResolvedValue({ data: mockData }),
};
```

### 3. Test Error Cases
```typescript
it('should handle errors', async () => {
  mockRepository.findOne.mockRejectedValue(new Error('DB Error'));
  
  await expect(service.findOne('id')).rejects.toThrow('DB Error');
});
```

### 4. Use Descriptive Test Names
```typescript
describe('AuthService', () => {
  describe('register', () => {
    it('should successfully register a new user with valid credentials', () => {
      // ...
    });
    
    it('should throw ConflictException when email already exists', () => {
      // ...
    });
  });
});
```

### 5. Clean Up After Tests
```typescript
afterEach(async () => {
  await repository.clear();
  jest.clearAllMocks();
});
```

## Manual Testing

### API Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Posts (Authenticated)
```bash
curl -X GET "http://localhost:3001/posts?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### API Testing with Postman

1. Import the OpenAPI spec from http://localhost:3001/api/docs-json
2. Set up environment variables for base URL and tokens
3. Create test collections for each module
4. Use Postman's test scripts for automated testing

### Frontend Testing

#### Manual Testing Checklist

- [ ] User registration flow
- [ ] User login flow
- [ ] Dashboard loads correctly
- [ ] Sentiment chart displays
- [ ] Ticker list shows data
- [ ] Theme cloud renders
- [ ] Post feed displays posts
- [ ] Time range filter works
- [ ] Strategy page loads
- [ ] Generate strategy button works
- [ ] Watchlist creation works
- [ ] Watchlist deletion works
- [ ] Ticker addition to watchlist works
- [ ] Logout works
- [ ] Token refresh works
- [ ] Mobile responsive design
- [ ] Error states display correctly
- [ ] Loading states display correctly

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: linda_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run tests
        run: cd backend && npm run test:cov
        env:
          DATABASE_HOST: localhost
          DATABASE_PORT: 5432
          REDIS_HOST: localhost
          REDIS_PORT: 6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run tests
        run: cd frontend && npm test
      
      - name: Build
        run: cd frontend && npm run build
```

## Load Testing

### Using Apache Bench

```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:3001/auth/login

# Test posts endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/posts
```

### Using Artillery

Create `artillery-config.yml`:

```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load

scenarios:
  - name: Browse posts
    flow:
      - post:
          url: '/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.accessToken'
              as: 'token'
      - get:
          url: '/posts'
          headers:
            Authorization: 'Bearer {{ token }}'
      - get:
          url: '/analysis/tickers'
          headers:
            Authorization: 'Bearer {{ token }}'
```

Run load test:
```bash
artillery run artillery-config.yml
```

## Performance Benchmarks

### Target Metrics

- **API Response Time**: < 200ms (p95)
- **Database Queries**: < 50ms (p95)
- **Cache Hit Rate**: > 80%
- **Job Processing**: < 5 minutes per batch
- **Frontend Load Time**: < 2 seconds

### Monitoring Performance

```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/posts

# Monitor database query performance
docker-compose exec postgres psql -U postgres -d linda -c "
  SELECT query, calls, total_time, mean_time 
  FROM pg_stat_statements 
  ORDER BY total_time DESC 
  LIMIT 10;
"

# Monitor Redis performance
docker-compose exec redis redis-cli --stat
```

## Test Data

### Seed Test Data

```bash
# Run seed script
npm run seed

# Or manually via SQL
docker-compose exec postgres psql -U postgres -d linda -f test-data.sql
```

### Mock Data Generators

Create `backend/src/test/factories/post.factory.ts`:

```typescript
import { Post } from '../../entities/post.entity';

export function createMockPost(overrides?: Partial<Post>): Post {
  return {
    id: 'uuid',
    accountId: 'account-uuid',
    postId: 'post-123',
    content: 'Test post content',
    postedAt: new Date(),
    upvotes: 100,
    commentsCount: 20,
    awardsCount: 5,
    engagementScore: 250,
    isAnalyzed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Post;
}
```

## Debugging Tests

### Enable Debug Logging

```bash
# Backend
DEBUG=* npm test

# With specific namespace
DEBUG=app:* npm test
```

### Run Single Test

```bash
# Backend
npm test -- --testNamePattern="should register a new user"

# Frontend
npm test -- PostFeed
```

### Debug in VSCode

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Common Testing Scenarios

### Testing Authentication Flow
1. Register new user
2. Login with credentials
3. Access protected endpoint with token
4. Refresh token
5. Logout

### Testing Post Ingestion
1. Add Reddit account
2. Trigger sync
3. Verify posts created
4. Check engagement scores
5. Verify no duplicates

### Testing Analysis Pipeline
1. Create unanalyzed post
2. Trigger analysis job
3. Verify PostAnalysis created
4. Check sentiment score
5. Verify tickers extracted

### Testing Strategy Generation
1. Create analyzed posts
2. Trigger strategy generation
3. Verify strategy created
4. Check bullish ideas
5. Verify confidence score

## Test Maintenance

### Keep Tests Updated
- Update tests when changing business logic
- Add tests for new features
- Remove tests for deprecated features
- Keep mock data realistic

### Review Test Coverage
```bash
# Generate coverage report
npm run test:cov

# View HTML report
open coverage/lcov-report/index.html
```

### Identify Gaps
- Look for uncovered lines
- Test edge cases
- Test error scenarios
- Test boundary conditions

## Troubleshooting Tests

### Tests Failing Randomly
- Check for race conditions
- Ensure proper cleanup
- Use `waitFor` for async operations
- Avoid hardcoded timeouts

### Database Tests Failing
- Ensure test database is running
- Check migrations are applied
- Verify test data setup
- Clear database between tests

### Mock Issues
- Verify mock return values
- Check mock function calls
- Reset mocks between tests
- Use proper mock types

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
