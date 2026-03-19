import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { Strategy } from '../../entities/strategy.entity';
import { UserSavedStrategy } from '../../entities/user-saved-strategy.entity';
import { PostAnalysis } from '../../entities/post-analysis.entity';
import { TickerMention } from '../../entities/ticker-mention.entity';
import { Post } from '../../entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Strategy,
      UserSavedStrategy,
      PostAnalysis,
      TickerMention,
      Post,
    ]),
  ],
  controllers: [StrategyController],
  providers: [StrategyService],
  exports: [StrategyService],
})
export class StrategyModule {}
