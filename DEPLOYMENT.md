# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Set up production database (PostgreSQL 15+)
- [ ] Set up Redis instance
- [ ] Obtain Reddit API credentials
- [ ] Generate secure JWT secrets (min 32 characters)
- [ ] Configure domain and SSL certificates
- [ ] Set up monitoring and logging infrastructure

### Environment Configuration

1. Create production `.env` file:
```bash
cp .env.example .env
```

2. Update all values with production credentials:
```env
NODE_ENV=production
DATABASE_HOST=your-db-host
DATABASE_PASSWORD=strong-password
REDIS_PASSWORD=strong-redis-password
JWT_SECRET=your-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-min-32-chars
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
```

### Deployment Options

## Option 1: Docker Compose (Recommended)

### Step 1: Build Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### Step 2: Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Step 3: Run Migrations
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run
```

### Step 4: Seed Initial Data
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### Step 5: Verify Deployment
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Option 2: Kubernetes

### Prerequisites
- Kubernetes cluster (GKE, EKS, AKS, or self-hosted)
- kubectl configured
- Helm 3+

### Step 1: Create Namespace
```bash
kubectl create namespace linda
```

### Step 2: Create Secrets
```bash
kubectl create secret generic linda-secrets \
  --from-literal=database-password=your-password \
  --from-literal=jwt-secret=your-jwt-secret \
  --from-literal=reddit-client-id=your-client-id \
  --from-literal=reddit-client-secret=your-client-secret \
  -n linda
```

### Step 3: Deploy PostgreSQL
```bash
helm install postgresql bitnami/postgresql \
  --set auth.postgresPassword=your-password \
  --set auth.database=linda \
  -n linda
```

### Step 4: Deploy Redis
```bash
helm install redis bitnami/redis \
  --set auth.password=your-redis-password \
  -n linda
```

### Step 5: Deploy Application
```bash
kubectl apply -f k8s/ -n linda
```

## Option 3: Cloud Platforms

### AWS Deployment

#### Using ECS Fargate

1. **Create ECR Repositories**:
```bash
aws ecr create-repository --repository-name linda-backend
aws ecr create-repository --repository-name linda-frontend
```

2. **Build and Push Images**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t linda-backend ./backend
docker tag linda-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/linda-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/linda-backend:latest

docker build -t linda-frontend ./frontend
docker tag linda-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/linda-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/linda-frontend:latest
```

3. **Set up RDS PostgreSQL**:
```bash
aws rds create-db-instance \
  --db-instance-identifier linda-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password <password> \
  --allocated-storage 20
```

4. **Set up ElastiCache Redis**:
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id linda-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

5. **Create ECS Task Definitions and Services** via AWS Console or CLI

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Push to GCR**:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/linda-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT_ID/linda-frontend ./frontend
```

2. **Deploy Services**:
```bash
gcloud run deploy linda-backend \
  --image gcr.io/PROJECT_ID/linda-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy linda-frontend \
  --image gcr.io/PROJECT_ID/linda-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. **Set up Cloud SQL (PostgreSQL)** and **Memorystore (Redis)** via GCP Console

### Vercel + Railway

#### Frontend on Vercel

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add environment variables in Vercel dashboard

#### Backend on Railway

1. Create new project in Railway
2. Add PostgreSQL and Redis services
3. Deploy from GitHub:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`
4. Add environment variables in Railway dashboard

## Post-Deployment

### 1. Run Health Checks
```bash
curl http://your-domain/api/health
curl http://your-domain/
```

### 2. Test Authentication
```bash
curl -X POST http://your-domain/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Verify Background Jobs
- Check job logs in database
- Monitor Redis queue
- Verify posts are being synced

### 4. Set Up Monitoring
- Configure application monitoring (New Relic, Datadog, etc.)
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up log aggregation

### 5. Configure Backups
- Database backups (daily)
- Redis snapshots
- Application logs retention

## Scaling Considerations

### Horizontal Scaling

1. **Backend**: Scale API instances behind load balancer
2. **Frontend**: Deploy to CDN (Vercel, Netlify, CloudFront)
3. **Database**: Use read replicas for read-heavy operations
4. **Redis**: Use Redis Cluster for high availability
5. **Job Workers**: Scale worker instances independently

### Performance Optimization

1. **Database**:
   - Enable connection pooling
   - Add appropriate indexes
   - Use materialized views for complex queries

2. **Caching**:
   - Increase Redis memory
   - Optimize cache TTL values
   - Implement cache warming

3. **API**:
   - Enable compression
   - Implement request throttling
   - Use CDN for static assets

## Monitoring & Maintenance

### Key Metrics to Monitor

1. **Application**:
   - API response times (p50, p95, p99)
   - Error rates
   - Request throughput

2. **Database**:
   - Connection pool usage
   - Query performance
   - Disk usage

3. **Redis**:
   - Memory usage
   - Hit/miss ratio
   - Connection count

4. **Jobs**:
   - Job completion rate
   - Job processing time
   - Failed job count

### Maintenance Tasks

1. **Daily**:
   - Review error logs
   - Check job execution status
   - Monitor API rate limits

2. **Weekly**:
   - Review performance metrics
   - Check database size
   - Update dependencies (security patches)

3. **Monthly**:
   - Database maintenance (VACUUM, ANALYZE)
   - Review and optimize slow queries
   - Audit user activity
   - Update documentation

## Rollback Procedure

If deployment fails:

1. **Docker Compose**:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

2. **Database Migration Rollback**:
```bash
docker-compose exec backend npm run migration:revert
```

3. **Restore from Backup**:
```bash
pg_restore -h localhost -U postgres -d linda backup.sql
```

## Security Hardening

### Production Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Enable SSL/TLS for all connections
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Implement request logging
- [ ] Enable security headers (helmet.js)
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement IP whitelisting for admin endpoints

### SSL/TLS Setup

1. **Using Let's Encrypt**:
```bash
certbot certonly --standalone -d your-domain.com
```

2. **Update Nginx Configuration**:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    # ... rest of config
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check DATABASE_HOST and credentials
   - Verify PostgreSQL is running
   - Check firewall rules

2. **Redis Connection Failed**:
   - Verify Redis is running
   - Check REDIS_HOST and password
   - Test with `redis-cli ping`

3. **Reddit API Errors**:
   - Verify API credentials
   - Check rate limits
   - Review Reddit API status

4. **Jobs Not Running**:
   - Check Redis connection
   - Verify BullMQ configuration
   - Review job logs in database

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Review documentation
3. Open GitHub issue with details
