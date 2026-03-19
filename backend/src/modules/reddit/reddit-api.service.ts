import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ApiRateLimit } from '../../entities/api-rate-limit.entity';
import { LoggerService } from '../../common/logger/logger.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class RedditApiService {
  private accessToken: string;
  private tokenExpiresAt: Date;
  private readonly baseUrl = 'https://oauth.reddit.com';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private logger: LoggerService,
    private cacheService: CacheService,
    @InjectRepository(ApiRateLimit)
    private rateLimitRepository: Repository<ApiRateLimit>,
  ) {}

  async authenticate(): Promise<void> {
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return;
    }

    try {
      const clientId = this.configService.get('REDDIT_CLIENT_ID');
      const clientSecret = this.configService.get('REDDIT_CLIENT_SECRET');
      const userAgent = this.configService.get('REDDIT_USER_AGENT');

      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(
          'https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': userAgent,
            },
          },
        ),
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      this.logger.log('Reddit API authenticated successfully', 'RedditApiService');
    } catch (error) {
      this.logger.error('Reddit authentication failed', error.stack, 'RedditApiService');
      throw new HttpException('Failed to authenticate with Reddit API', 500);
    }
  }

  async getUserPosts(username: string, limit: number = 100): Promise<any[]> {
    await this.authenticate();
    await this.checkRateLimit('user_posts');

    const cacheKey = `reddit:posts:${username}:${limit}`;
    const cached = await this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const userAgent = this.configService.get('REDDIT_USER_AGENT');
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/user/${username}/submitted`, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': userAgent,
          },
          params: {
            limit,
            sort: 'new',
          },
        }),
      );

      await this.updateRateLimit('user_posts', response.headers);

      const posts = response.data.data.children.map((child: any) => child.data);
      await this.cacheService.set(cacheKey, posts, 900);

      return posts;
    } catch (error) {
      this.logger.error(
        `Failed to fetch posts for user ${username}`,
        error.stack,
        'RedditApiService',
      );
      throw new HttpException('Failed to fetch user posts', 500);
    }
  }

  async getUserInfo(username: string): Promise<any> {
    await this.authenticate();
    await this.checkRateLimit('user_info');

    const cacheKey = `reddit:user:${username}`;
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const userAgent = this.configService.get('REDDIT_USER_AGENT');
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/user/${username}/about`, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': userAgent,
          },
        }),
      );

      await this.updateRateLimit('user_info', response.headers);

      const userInfo = response.data.data;
      await this.cacheService.set(cacheKey, userInfo, 3600);

      return userInfo;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user info for ${username}`,
        error.stack,
        'RedditApiService',
      );
      throw new HttpException('Failed to fetch user info', 500);
    }
  }

  private async checkRateLimit(endpoint: string): Promise<void> {
    const rateLimit = await this.rateLimitRepository.findOne({
      where: { endpoint },
    });

    if (rateLimit && rateLimit.resetAt && new Date() < rateLimit.resetAt) {
      if (rateLimit.remainingCalls !== null && rateLimit.remainingCalls <= 0) {
        const waitTime = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);
        this.logger.warn(
          `Rate limit reached for ${endpoint}, wait ${waitTime}s`,
          'RedditApiService',
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
      }
    }
  }

  private async updateRateLimit(endpoint: string, headers: any): Promise<void> {
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];

    if (remaining !== undefined && reset !== undefined) {
      const resetAt = new Date(parseInt(reset) * 1000);

      await this.rateLimitRepository.upsert(
        {
          endpoint,
          remainingCalls: parseInt(remaining),
          resetAt,
          lastCalledAt: new Date(),
        },
        ['endpoint'],
      );
    }
  }

  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        this.logger.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
          'RedditApiService',
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
