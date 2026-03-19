import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Strategy } from '../../entities/strategy.entity';
import { UserSavedStrategy } from '../../entities/user-saved-strategy.entity';
import { PostAnalysis, Sentiment } from '../../entities/post-analysis.entity';
import { TickerMention } from '../../entities/ticker-mention.entity';
import { Post } from '../../entities/post.entity';
import { LoggerService } from '../../common/logger/logger.service';
import { CacheService } from '../../common/cache/cache.service';

interface StrategyData {
  bullishIdeas: any[];
  bearishRisks: any[];
  trendingOpportunities: any[];
  consensusSignals: any[];
  confidenceScore: number;
}

@Injectable()
export class StrategyService {
  constructor(
    @InjectRepository(Strategy)
    private strategyRepository: Repository<Strategy>,
    @InjectRepository(UserSavedStrategy)
    private savedStrategyRepository: Repository<UserSavedStrategy>,
    @InjectRepository(PostAnalysis)
    private analysisRepository: Repository<PostAnalysis>,
    @InjectRepository(TickerMention)
    private tickerMentionRepository: Repository<TickerMention>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private logger: LoggerService,
    private cacheService: CacheService,
  ) {}

  async generateStrategy(days: number = 7): Promise<Strategy> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analyses = await this.analysisRepository
      .createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.post', 'post')
      .where('analysis.analyzed_at >= :startDate', { startDate })
      .getMany();

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.posted_at >= :startDate', { startDate })
      .getCount();

    const accounts = await this.postRepository
      .createQueryBuilder('post')
      .select('COUNT(DISTINCT post.account_id)', 'count')
      .where('post.posted_at >= :startDate', { startDate })
      .getRawOne();

    const strategyData = await this.buildStrategyData(analyses, days);

    const strategy = this.strategyRepository.create({
      title: `Investment Strategy - ${new Date().toLocaleDateString()}`,
      summary: this.generateSummary(strategyData),
      bullishIdeas: strategyData.bullishIdeas,
      bearishRisks: strategyData.bearishRisks,
      trendingOpportunities: strategyData.trendingOpportunities,
      consensusSignals: strategyData.consensusSignals,
      confidenceScore: strategyData.confidenceScore,
      timePeriod: `${days} days`,
      postCount: posts,
      accountCount: parseInt(accounts.count),
    });

    await this.strategyRepository.save(strategy);

    await this.cacheService.del('strategy:current');

    this.logger.log('Generated new strategy report', 'StrategyService');

    return strategy;
  }

  private async buildStrategyData(
    analyses: PostAnalysis[],
    days: number,
  ): Promise<StrategyData> {
    const bullishAnalyses = analyses.filter((a) => a.sentiment === Sentiment.BULLISH);
    const bearishAnalyses = analyses.filter((a) => a.sentiment === Sentiment.BEARISH);

    const bullishIdeas = await this.extractBullishIdeas(bullishAnalyses);
    const bearishRisks = await this.extractBearishRisks(bearishAnalyses);
    const trendingOpportunities = await this.findTrendingOpportunities(days);
    const consensusSignals = await this.detectConsensus(days);

    const confidenceScore = this.calculateConfidenceScore(
      bullishIdeas,
      bearishRisks,
      consensusSignals,
    );

    return {
      bullishIdeas,
      bearishRisks,
      trendingOpportunities,
      consensusSignals,
      confidenceScore,
    };
  }

  private async extractBullishIdeas(analyses: PostAnalysis[]): Promise<any[]> {
    const tickerSentiment: { [key: string]: { count: number; avgScore: number; posts: any[] } } = {};

    analyses.forEach((analysis) => {
      analysis.tickers.forEach((ticker) => {
        if (!tickerSentiment[ticker]) {
          tickerSentiment[ticker] = { count: 0, avgScore: 0, posts: [] };
        }
        tickerSentiment[ticker].count++;
        tickerSentiment[ticker].avgScore += analysis.sentimentScore;
        tickerSentiment[ticker].posts.push({
          content: analysis.keyPhrases[0],
          conviction: analysis.convictionLevel,
        });
      });
    });

    return Object.entries(tickerSentiment)
      .map(([ticker, data]) => ({
        ticker,
        mentions: data.count,
        avgSentiment: data.avgScore / data.count,
        topInsights: data.posts.slice(0, 3),
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);
  }

  private async extractBearishRisks(analyses: PostAnalysis[]): Promise<any[]> {
    const risks: { [key: string]: { count: number; severity: number; examples: string[] } } = {};

    analyses.forEach((analysis) => {
      analysis.themes.forEach((theme) => {
        if (!risks[theme]) {
          risks[theme] = { count: 0, severity: 0, examples: [] };
        }
        risks[theme].count++;
        risks[theme].severity += Math.abs(analysis.sentimentScore);
        if (analysis.keyPhrases[0]) {
          risks[theme].examples.push(analysis.keyPhrases[0]);
        }
      });
    });

    return Object.entries(risks)
      .map(([theme, data]) => ({
        theme,
        mentions: data.count,
        severity: data.severity / data.count,
        examples: data.examples.slice(0, 2),
      }))
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 8);
  }

  private async findTrendingOpportunities(days: number): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trending = await this.tickerMentionRepository
      .createQueryBuilder('mention')
      .select('mention.ticker', 'ticker')
      .addSelect('COUNT(*)', 'recentMentions')
      .addSelect('COUNT(DISTINCT mention.post_id)', 'postCount')
      .where('mention.mentioned_at >= :startDate', { startDate })
      .andWhere("mention.sentiment = 'bullish'")
      .groupBy('mention.ticker')
      .having('COUNT(*) >= 3')
      .orderBy('COUNT(*)', 'DESC')
      .limit(10)
      .getRawMany();

    return trending;
  }

  private async detectConsensus(days: number): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const consensus = await this.tickerMentionRepository
      .createQueryBuilder('mention')
      .leftJoin('mention.post', 'post')
      .select('mention.ticker', 'ticker')
      .addSelect('COUNT(DISTINCT post.account_id)', 'accountCount')
      .addSelect('COUNT(*)', 'totalMentions')
      .addSelect('AVG(CASE WHEN mention.sentiment = \'bullish\' THEN 1 WHEN mention.sentiment = \'bearish\' THEN -1 ELSE 0 END)', 'avgSentiment')
      .where('mention.mentioned_at >= :startDate', { startDate })
      .groupBy('mention.ticker')
      .having('COUNT(DISTINCT post.account_id) >= 3')
      .orderBy('COUNT(DISTINCT post.account_id)', 'DESC')
      .limit(10)
      .getRawMany();

    return consensus;
  }

  private calculateConfidenceScore(
    bullishIdeas: any[],
    bearishRisks: any[],
    consensusSignals: any[],
  ): number {
    const bullishWeight = Math.min(bullishIdeas.length / 10, 1) * 0.4;
    const consensusWeight = Math.min(consensusSignals.length / 5, 1) * 0.4;
    const diversityWeight = bearishRisks.length > 0 ? 0.2 : 0;

    return bullishWeight + consensusWeight + diversityWeight;
  }

  private generateSummary(data: StrategyData): string {
    const topBullish = data.bullishIdeas.slice(0, 3).map((i) => i.ticker).join(', ');
    const topRisks = data.bearishRisks.slice(0, 2).map((r) => r.theme).join(', ');

    return `Current market sentiment shows bullish momentum in ${topBullish}. Key risks to monitor: ${topRisks}. Confidence: ${(data.confidenceScore * 100).toFixed(0)}%`;
  }

  async getCurrentStrategy(): Promise<Strategy | null> {
    const cacheKey = 'strategy:current';
    const cached = await this.cacheService.get<Strategy>(cacheKey);
    if (cached) return cached;

    const strategy = await this.strategyRepository.findOne({
      order: { generatedAt: 'DESC' },
    });

    if (strategy) {
      await this.cacheService.set(cacheKey, strategy, 1800);
    }

    return strategy;
  }

  async getStrategyHistory(limit: number = 10): Promise<Strategy[]> {
    return this.strategyRepository.find({
      order: { generatedAt: 'DESC' },
      take: limit,
    });
  }

  async saveStrategyForUser(userId: string, strategyId: string, notes?: string) {
    const saved = this.savedStrategyRepository.create({
      userId,
      strategyId,
      notes,
    });

    await this.savedStrategyRepository.save(saved);
    return saved;
  }

  async getUserSavedStrategies(userId: string): Promise<UserSavedStrategy[]> {
    return this.savedStrategyRepository.find({
      where: { userId },
      relations: ['strategy'],
      order: { savedAt: 'DESC' },
    });
  }
}
