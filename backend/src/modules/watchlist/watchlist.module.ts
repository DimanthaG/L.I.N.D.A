import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { Watchlist } from '../../entities/watchlist.entity';
import { WatchlistTicker } from '../../entities/watchlist-ticker.entity';
import { RedditAccount } from '../../entities/reddit-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, WatchlistTicker, RedditAccount])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
