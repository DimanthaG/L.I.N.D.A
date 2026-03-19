import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

export enum Sentiment {
  BULLISH = 'bullish',
  BEARISH = 'bearish',
  NEUTRAL = 'neutral',
}

export enum ConvictionLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('post_analysis')
export class PostAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'uuid', unique: true })
  postId: string;

  @OneToOne(() => Post, (post) => post.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({
    type: 'enum',
    enum: Sentiment,
  })
  sentiment: Sentiment;

  @Column({ name: 'sentiment_score', type: 'decimal', precision: 5, scale: 4 })
  sentimentScore: number;

  @Column({
    name: 'conviction_level',
    type: 'enum',
    enum: ConvictionLevel,
    nullable: true,
  })
  convictionLevel?: ConvictionLevel;

  @Column({ name: 'conviction_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  convictionScore?: number;

  @Column({ type: 'text', array: true, default: [] })
  tickers: string[];

  @Column({ type: 'text', array: true, default: [] })
  sectors: string[];

  @Column({ type: 'text', array: true, default: [] })
  themes: string[];

  @Column({ name: 'macro_signals', type: 'text', array: true, default: [] })
  macroSignals: string[];

  @Column({ name: 'key_phrases', type: 'text', array: true, default: [] })
  keyPhrases: string[];

  @Column({ name: 'is_actionable', default: false })
  isActionable: boolean;

  @Column({ name: 'analyzed_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  analyzedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
