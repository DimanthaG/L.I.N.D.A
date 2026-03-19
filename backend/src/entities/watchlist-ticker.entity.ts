import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Watchlist } from './watchlist.entity';

@Entity('watchlist_tickers')
@Unique(['watchlistId', 'ticker'])
export class WatchlistTicker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'watchlist_id', type: 'uuid' })
  watchlistId: string;

  @ManyToOne(() => Watchlist, (watchlist) => watchlist.tickers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'watchlist_id' })
  watchlist: Watchlist;

  @Column({ length: 20 })
  ticker: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
