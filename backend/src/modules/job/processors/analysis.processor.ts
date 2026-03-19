import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AnalysisService } from '../../analysis/analysis.service';
import { JobService } from '../job.service';
import { JobStatus } from '../../../entities/job-log.entity';
import { LoggerService } from '../../../common/logger/logger.service';

@Processor('analysis')
export class AnalysisProcessor {
  constructor(
    private analysisService: AnalysisService,
    private jobService: JobService,
    private logger: LoggerService,
  ) {}

  @Process('analyze-posts')
  async handleAnalyzePosts(job: Job) {
    this.logger.log(`Processing analysis job ${job.id}`, 'AnalysisProcessor');

    try {
      await this.jobService.updateJobLog(job.id.toString(), JobStatus.ACTIVE);

      const analyzed = await this.analysisService.analyzeUnprocessedPosts(50);

      await this.jobService.updateJobLog(job.id.toString(), JobStatus.COMPLETED);

      this.logger.log(`Analysis job completed: ${analyzed} posts analyzed`, 'AnalysisProcessor');

      return { analyzed };
    } catch (error) {
      this.logger.error(`Analysis job ${job.id} failed`, error.stack, 'AnalysisProcessor');
      await this.jobService.updateJobLog(
        job.id.toString(),
        JobStatus.FAILED,
        error.message,
      );
      throw error;
    }
  }
}
