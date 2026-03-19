import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisService } from './analysis.service';
import { SentimentService } from './sentiment.service';
import { TickerService } from './ticker.service';
import { ThemeService } from './theme.service';
import { AnalysisController } from './analysis.controller';
import { Post } from '../../entities/post.entity';
import { PostAnalysis } from '../../entities/post-analysis.entity';
import { TickerMention } from '../../entities/ticker-mention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostAnalysis, TickerMention])],
  controllers: [AnalysisController],
  providers: [AnalysisService, SentimentService, TickerService, ThemeService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
