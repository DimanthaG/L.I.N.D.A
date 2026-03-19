import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobLog, JobStatus } from '../../entities/job-log.entity';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class JobService implements OnModuleInit {
  constructor(
    @InjectQueue('sync') private syncQueue: Queue,
    @InjectQueue('analysis') private analysisQueue: Queue,
    @InjectQueue('strategy') private strategyQueue: Queue,
    @InjectRepository(JobLog)
    private jobLogRepository: Repository<JobLog>,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Job service initialized', 'JobService');
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async scheduleSyncJob() {
    const job = await this.syncQueue.add('sync-all-accounts', {}, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    await this.logJob('sync-all-accounts', job.id.toString(), JobStatus.PENDING);
    this.logger.log('Scheduled sync job', 'JobService');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduleAnalysisJob() {
    const job = await this.analysisQueue.add('analyze-posts', {}, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    await this.logJob('analyze-posts', job.id.toString(), JobStatus.PENDING);
    this.logger.log('Scheduled analysis job', 'JobService');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async scheduleStrategyJob() {
    const job = await this.strategyQueue.add('generate-strategy', {}, {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });

    await this.logJob('generate-strategy', job.id.toString(), JobStatus.PENDING);
    this.logger.log('Scheduled strategy generation job', 'JobService');
  }

  async triggerSyncJob() {
    return this.syncQueue.add('sync-all-accounts', {});
  }

  async triggerAnalysisJob() {
    return this.analysisQueue.add('analyze-posts', {});
  }

  async triggerStrategyJob() {
    return this.strategyQueue.add('generate-strategy', {});
  }

  async logJob(
    jobName: string,
    jobId: string,
    status: JobStatus,
    metadata?: any,
  ): Promise<JobLog> {
    const log = this.jobLogRepository.create({
      jobName,
      jobId,
      status,
      metadata,
      startedAt: status === JobStatus.ACTIVE ? new Date() : undefined,
      completedAt: [JobStatus.COMPLETED, JobStatus.FAILED].includes(status)
        ? new Date()
        : undefined,
    });

    return this.jobLogRepository.save(log);
  }

  async updateJobLog(
    jobId: string,
    status: JobStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.jobLogRepository.update(
      { jobId },
      {
        status,
        completedAt: [JobStatus.COMPLETED, JobStatus.FAILED].includes(status)
          ? new Date()
          : undefined,
        errorMessage,
      },
    );
  }

  async getJobLogs(limit: number = 50): Promise<JobLog[]> {
    return this.jobLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
