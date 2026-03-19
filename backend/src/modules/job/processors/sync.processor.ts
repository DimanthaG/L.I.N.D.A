import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RedditService } from '../../reddit/reddit.service';
import { JobService } from '../job.service';
import { JobStatus } from '../../../entities/job-log.entity';
import { LoggerService } from '../../../common/logger/logger.service';

@Processor('sync')
export class SyncProcessor {
  constructor(
    private redditService: RedditService,
    private jobService: JobService,
    private logger: LoggerService,
  ) {}

  @Process('sync-all-accounts')
  async handleSyncAllAccounts(job: Job) {
    this.logger.log(`Processing sync job ${job.id}`, 'SyncProcessor');

    try {
      await this.jobService.updateJobLog(job.id.toString(), JobStatus.ACTIVE);

      const result = await this.redditService.syncAllAccounts();

      await this.jobService.updateJobLog(job.id.toString(), JobStatus.COMPLETED);

      this.logger.log(
        `Sync job completed: ${result.synced}/${result.total} accounts synced`,
        'SyncProcessor',
      );

      return result;
    } catch (error) {
      this.logger.error(`Sync job ${job.id} failed`, error.stack, 'SyncProcessor');
      await this.jobService.updateJobLog(
        job.id.toString(),
        JobStatus.FAILED,
        error.message,
      );
      throw error;
    }
  }
}
