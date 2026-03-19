import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { RedditAccount } from './reddit-account.entity';
import { PostAnalysis } from './post-analysis.entity';
import { TickerMention } from './ticker-mention.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @ManyToOne(() => RedditAccount, (account) => account.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: RedditAccount;

  @Column({ name: 'post_id', unique: true, length: 100 })
  postId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'posted_at', type: 'timestamp' })
  postedAt: Date;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'awards_count', default: 0 })
  awardsCount: number;

  @Column({ name: 'engagement_score', type: 'decimal', precision: 10, scale: 2, nullable: true })
  engagementScore?: number;

  @Column({ type: 'text', nullable: true })
  url?: string;

  @Column({ name: 'media_urls', type: 'text', array: true, default: [] })
  mediaUrls: string[];

  @Column({ name: 'is_analyzed', default: false })
  isAnalyzed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => PostAnalysis, (analysis) => analysis.post)
  analysis: PostAnalysis;

  @OneToMany(() => TickerMention, (mention) => mention.post)
  tickerMentions: TickerMention[];
}
