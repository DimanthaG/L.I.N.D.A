import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum JobStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
}

@Entity('job_logs')
export class JobLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_name', length: 255 })
  jobName: string;

  @Column({ name: 'job_id', length: 255, nullable: true })
  jobId?: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
  })
  status: JobStatus;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
