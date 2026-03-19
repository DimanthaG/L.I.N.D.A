import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Sentiment } from './post-analysis.entity';

@Entity('ticker_mentions')
export class TickerMention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  ticker: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => Post, (post) => post.tickerMentions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'mention_count', default: 1 })
  mentionCount: number;

  @Column({ type: 'text', nullable: true })
  context?: string;

  @Column({
    type: 'enum',
    enum: Sentiment,
    nullable: true,
  })
  sentiment?: Sentiment;

  @Column({ name: 'mentioned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  mentionedAt: Date;
}
