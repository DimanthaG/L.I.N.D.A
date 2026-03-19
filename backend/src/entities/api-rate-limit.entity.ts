import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('api_rate_limits')
export class ApiRateLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  endpoint: string;

  @Column({ name: 'remaining_calls', nullable: true })
  remainingCalls?: number;

  @Column({ name: 'reset_at', type: 'timestamp', nullable: true })
  resetAt?: Date;

  @Column({ name: 'last_called_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastCalledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
