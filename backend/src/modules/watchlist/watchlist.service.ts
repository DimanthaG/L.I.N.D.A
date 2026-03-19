import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from '../../entities/watchlist.entity';
import { WatchlistTicker } from '../../entities/watchlist-ticker.entity';
import { RedditAccount } from '../../entities/reddit-account.entity';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(WatchlistTicker)
    private watchlistTickerRepository: Repository<WatchlistTicker>,
    @InjectRepository(RedditAccount)
    private redditAccountRepository: Repository<RedditAccount>,
    private logger: LoggerService,
  ) {}

  async create(userId: string, createDto: CreateWatchlistDto): Promise<Watchlist> {
    const watchlist = this.watchlistRepository.create({
      userId,
      name: createDto.name,
      description: createDto.description,
      isDefault: createDto.isDefault || false,
    });

    await this.watchlistRepository.save(watchlist);

    if (createDto.accountIds && createDto.accountIds.length > 0) {
      const accounts = await this.redditAccountRepository.findBy({
        id: In(createDto.accountIds),
      });
      watchlist.accounts = accounts;
      await this.watchlistRepository.save(watchlist);
    }

    if (createDto.tickers && createDto.tickers.length > 0) {
      for (const ticker of createDto.tickers) {
        const watchlistTicker = this.watchlistTickerRepository.create({
          watchlistId: watchlist.id,
          ticker: ticker.toUpperCase(),
        });
        await this.watchlistTickerRepository.save(watchlistTicker);
      }
    }

    this.logger.log(`Created watchlist: ${watchlist.name}`, 'WatchlistService');

    return this.findOne(watchlist.id);
  }

  async findAll(userId: string): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { userId },
      relations: ['accounts', 'tickers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Watchlist> {
    const watchlist = await this.watchlistRepository.findOne({
      where: { id },
      relations: ['accounts', 'tickers'],
    });

    if (!watchlist) {
      throw new NotFoundException(`Watchlist with ID ${id} not found`);
    }

    return watchlist;
  }

  async update(id: string, updateDto: UpdateWatchlistDto): Promise<Watchlist> {
    const watchlist = await this.findOne(id);

    if (updateDto.name) watchlist.name = updateDto.name;
    if (updateDto.description !== undefined) watchlist.description = updateDto.description;
    if (updateDto.isDefault !== undefined) watchlist.isDefault = updateDto.isDefault;

    await this.watchlistRepository.save(watchlist);

    if (updateDto.accountIds) {
      const accounts = await this.redditAccountRepository.findBy({
        id: In(updateDto.accountIds),
      });
      watchlist.accounts = accounts;
      await this.watchlistRepository.save(watchlist);
    }

    this.logger.log(`Updated watchlist: ${watchlist.name}`, 'WatchlistService');

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const watchlist = await this.findOne(id);
    await this.watchlistRepository.remove(watchlist);
    this.logger.log(`Removed watchlist: ${watchlist.name}`, 'WatchlistService');
  }

  async addTicker(watchlistId: string, ticker: string, notes?: string) {
    const watchlist = await this.findOne(watchlistId);

    const watchlistTicker = this.watchlistTickerRepository.create({
      watchlistId: watchlist.id,
      ticker: ticker.toUpperCase(),
      notes,
    });

    await this.watchlistTickerRepository.save(watchlistTicker);
    return watchlistTicker;
  }

  async removeTicker(watchlistId: string, ticker: string) {
    await this.watchlistTickerRepository.delete({
      watchlistId,
      ticker: ticker.toUpperCase(),
    });
  }
}
