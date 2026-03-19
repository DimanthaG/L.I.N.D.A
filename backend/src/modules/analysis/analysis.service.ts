import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostAnalysis } from '../../entities/post-analysis.entity';
import { TickerMention } from '../../entities/ticker-mention.entity';
import { SentimentService } from './sentiment.service';
import { TickerService } from './ticker.service';
import { ThemeService } from './theme.service';
import { LoggerService } from '../../common/logger/logger.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostAnalysis)
    private analysisRepository: Repository<PostAnalysis>,
    @InjectRepository(TickerMention)
    private tickerMentionRepository: Repository<TickerMention>,
    private sentimentService: SentimentService,
    private tickerService: TickerService,
    private themeService: ThemeService,
    private logger: LoggerService,
    private cacheService: CacheService,
  ) {}

  async analyzePost(postId: string): Promise<PostAnalysis> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const existingAnalysis = await this.analysisRepository.findOne({
      where: { postId },
    });
    if (existingAnalysis) {
      return existingAnalysis;
    }

    const sentimentResult = this.sentimentService.analyzeSentiment(post.content);
    const tickerExtraction = this.tickerService.extractTickers(post.content);
    const themeExtraction = this.themeService.extractThemes(post.content);

    const analysis = this.analysisRepository.create({
      postId: post.id,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.sentimentScore,
      convictionLevel: sentimentResult.convictionLevel,
      convictionScore: sentimentResult.convictionScore,
      tickers: tickerExtraction.tickers,
      sectors: tickerExtraction.sectors,
      themes: themeExtraction.themes,
      macroSignals: themeExtraction.macroSignals,
      keyPhrases: themeExtraction.keyPhrases,
      isActionable: themeExtraction.isActionable,
    });

    await this.analysisRepository.save(analysis);

    for (const ticker of tickerExtraction.tickers) {
      const context = tickerExtraction.context.get(ticker);
      const mention = this.tickerMentionRepository.create({
        ticker,
        postId: post.id,
        mentionCount: 1,
        context,
        sentiment: sentimentResult.sentiment,
      });
      await this.tickerMentionRepository.save(mention);
    }

    post.isAnalyzed = true;
    await this.postRepository.save(post);

    this.logger.log(`Analyzed post ${post.postId}`, 'AnalysisService');

    return analysis;
  }

  async analyzeUnprocessedPosts(limit: number = 50): Promise<number> {
    const unanalyzedPosts = await this.postRepository.find({
      where: { isAnalyzed: false },
      take: limit,
      order: { postedAt: 'DESC' },
    });

    let analyzed = 0;

    for (const post of unanalyzedPosts) {
      try {
        await this.analyzePost(post.id);
        analyzed++;
      } catch (error) {
        this.logger.error(
          `Failed to analyze post ${post.id}`,
          error.stack,
          'AnalysisService',
        );
      }
    }

    return analyzed;
  }

  async getSentimentTrends(days: number = 7) {
    const cacheKey = `analysis:sentiment:${days}d`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.analysisRepository
      .createQueryBuilder('analysis')
      .select('analysis.sentiment', 'sentiment')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(analysis.sentiment_score)', 'avgScore')
      .where('analysis.analyzed_at >= :startDate', { startDate })
      .groupBy('analysis.sentiment')
      .getRawMany();

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  async getTrendingTickers(days: number = 7, limit: number = 20) {
    const cacheKey = `analysis:tickers:${days}d:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.tickerMentionRepository
      .createQueryBuilder('mention')
      .select('mention.ticker', 'ticker')
      .addSelect('COUNT(*)', 'mentionCount')
      .addSelect('COUNT(DISTINCT mention.post_id)', 'postCount')
      .addSelect(
        `AVG(CASE 
          WHEN mention.sentiment = 'bullish' THEN 1 
          WHEN mention.sentiment = 'bearish' THEN -1 
          ELSE 0 
        END)`,
        'avgSentiment',
      )
      .where('mention.mentioned_at >= :startDate', { startDate })
      .groupBy('mention.ticker')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    await this.cacheService.set(cacheKey, result, 1800);
    return result;
  }

  async getSectorDistribution(days: number = 7) {
    const cacheKey = `analysis:sectors:${days}d`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analyses = await this.analysisRepository.find({
      where: {
        analyzedAt: Between(startDate, new Date()),
      },
    });

    const sectorCounts: { [key: string]: number } = {};

    analyses.forEach((analysis) => {
      analysis.sectors.forEach((sector) => {
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });
    });

    const result = Object.entries(sectorCounts)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  async getTrendingThemes(days: number = 7, limit: number = 15) {
    const cacheKey = `analysis:themes:${days}d:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analyses = await this.analysisRepository.find({
      where: {
        analyzedAt: Between(startDate, new Date()),
      },
    });

    const themeCounts: { [key: string]: number } = {};

    analyses.forEach((analysis) => {
      analysis.themes.forEach((theme) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    const result = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }
}
