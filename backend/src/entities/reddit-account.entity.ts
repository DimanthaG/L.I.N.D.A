import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { Watchlist } from './watchlist.entity';

@Entity('reddit_accounts')
export class RedditAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ name: 'display_name', length: 255, nullable: true })
  displayName?: string;

  @Column({ name: 'account_id', length: 100, nullable: true })
  accountId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'followers_count', default: 0 })
  followersCount: number;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_synced_at', type: 'timestamp', nullable: true })
  lastSyncedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.account)
  posts: Post[];

  @ManyToMany(() => Watchlist, (watchlist) => watchlist.accounts)
  watchlists: Watchlist[];
}
