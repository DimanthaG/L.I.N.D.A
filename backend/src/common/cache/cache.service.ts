import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CacheService {
  private client: RedisClientType;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.initializeRedis();
  }

  private async initializeRedis() {
    this.client = createClient({
      socket: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
      },
      password: this.configService.get('REDIS_PASSWORD'),
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err.stack, 'CacheService');
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected', 'CacheService');
    });

    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}`, error.stack, 'CacheService');
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}`, error.stack, 'CacheService');
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}`, error.stack, 'CacheService');
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      this.logger.error(`Cache delete pattern error for ${pattern}`, error.stack, 'CacheService');
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}`, error.stack, 'CacheService');
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Cache TTL error for key ${key}`, error.stack, 'CacheService');
      return -1;
    }
  }
}
