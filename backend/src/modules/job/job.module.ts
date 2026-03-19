import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobService } from './job.service';
import { SyncProcessor } from './processors/sync.processor';
import { AnalysisProcessor } from './processors/analysis.processor';
import { StrategyProcessor } from './processors/strategy.processor';
import { JobLog } from '../../entities/job-log.entity';
import { RedditModule } from '../reddit/reddit.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { StrategyModule } from '../strategy/strategy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobLog]),
    BullModule.registerQueue(
      { name: 'sync' },
      { name: 'analysis' },
      { name: 'strategy' },
    ),
    RedditModule,
    AnalysisModule,
    StrategyModule,
  ],
  providers: [JobService, SyncProcessor, AnalysisProcessor, StrategyProcessor],
  exports: [JobService],
})
export class JobModule {}
