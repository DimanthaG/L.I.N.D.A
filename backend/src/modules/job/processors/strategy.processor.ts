import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StrategyService } from '../../strategy/strategy.service';
import { JobService } from '../job.service';
import { JobStatus } from '../../../entities/job-log.entity';
import { LoggerService } from '../../../common/logger/logger.service';

@Processor('strategy')
export class StrategyProcessor {
  constructor(
    private strategyService: StrategyService,
    private jobService: JobService,
    private logger: LoggerService,
  ) {}

  @Process('generate-strategy')
  async handleGenerateStrategy(job: Job) {
    this.logger.log(`Processing strategy job ${job.id}`, 'StrategyProcessor');

    try {
      await this.jobService.updateJobLog(job.id.toString(), JobStatus.ACTIVE);

      const strategy = await this.strategyService.generateStrategy(7);

      await this.jobService.updateJobLog(job.id.toString(), JobStatus.COMPLETED);

      this.logger.log(`Strategy job completed: ${strategy.id}`, 'StrategyProcessor');

      return { strategyId: strategy.id };
    } catch (error) {
      this.logger.error(`Strategy job ${job.id} failed`, error.stack, 'StrategyProcessor');
      await this.jobService.updateJobLog(
        job.id.toString(),
        JobStatus.FAILED,
        error.message,
      );
      throw error;
    }
  }
}
