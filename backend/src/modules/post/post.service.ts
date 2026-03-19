import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostAnalysis } from '../../entities/post-analysis.entity';
import { CacheService } from '../../common/cache/cache.service';

export interface PostFilters {
  accountIds?: string[];
  startDate?: Date;
  endDate?: Date;
  sentiment?: string;
  tickers?: string[];
  limit?: number;
  offset?: number;
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostAnalysis)
    private analysisRepository: Repository<PostAnalysis>,
    private cacheService: CacheService,
  ) {}

  async findAll(filters: PostFilters = {}) {
    const {
      accountIds,
      startDate,
      endDate,
      sentiment,
      tickers,
      limit = 50,
      offset = 0,
    } = filters;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.account', 'account')
      .leftJoinAndSelect('post.analysis', 'analysis')
      .orderBy('post.posted_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (accountIds && accountIds.length > 0) {
      query.andWhere('post.account_id IN (:...accountIds)', { accountIds });
    }

    if (startDate) {
      query.andWhere('post.posted_at >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('post.posted_at <= :endDate', { endDate });
    }

    if (sentiment) {
      query.andWhere('analysis.sentiment = :sentiment', { sentiment });
    }

    if (tickers && tickers.length > 0) {
      query.andWhere('analysis.tickers && ARRAY[:...tickers]', { tickers });
    }

    const [posts, total] = await query.getManyAndCount();

    return {
      data: posts,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['account', 'analysis', 'tickerMentions'],
    });
  }

  async getPostsByAccount(accountId: string, limit: number = 50) {
    return this.postRepository.find({
      where: { accountId },
      relations: ['analysis'],
      order: { postedAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentPosts(days: number = 7, limit: number = 100) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.postRepository.find({
      where: {
        postedAt: Between(startDate, new Date()),
      },
      relations: ['account', 'analysis'],
      order: { engagementScore: 'DESC' },
      take: limit,
    });
  }

  async getTopEngagingPosts(days: number = 7, limit: number = 20) {
    const cacheKey = `posts:top:${days}d:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const posts = await this.postRepository.find({
      where: {
        postedAt: Between(startDate, new Date()),
      },
      relations: ['account', 'analysis'],
      order: { engagementScore: 'DESC' },
      take: limit,
    });

    await this.cacheService.set(cacheKey, posts, 1800);
    return posts;
  }
}
