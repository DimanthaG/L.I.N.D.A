import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSavedStrategy } from './user-saved-strategy.entity';

@Entity('strategies')
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ name: 'bullish_ideas', type: 'jsonb', nullable: true })
  bullishIdeas?: any;

  @Column({ name: 'bearish_risks', type: 'jsonb', nullable: true })
  bearishRisks?: any;

  @Column({ name: 'trending_opportunities', type: 'jsonb', nullable: true })
  trendingOpportunities?: any;

  @Column({ name: 'consensus_signals', type: 'jsonb', nullable: true })
  consensusSignals?: any;

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  confidenceScore?: number;

  @Column({ name: 'time_period', length: 50, nullable: true })
  timePeriod?: string;

  @Column({ name: 'post_count', nullable: true })
  postCount?: number;

  @Column({ name: 'account_count', nullable: true })
  accountCount?: number;

  @Column({ name: 'generated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserSavedStrategy, (saved) => saved.strategy)
  savedByUsers: UserSavedStrategy[];
}
