import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedditAccount } from '../../entities/reddit-account.entity';
import { CreateRedditAccountDto } from './dto/create-reddit-account.dto';
import { UpdateRedditAccountDto } from './dto/update-reddit-account.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class RedditAccountService {
  constructor(
    @InjectRepository(RedditAccount)
    private redditAccountRepository: Repository<RedditAccount>,
    private logger: LoggerService,
  ) {}

  async create(createDto: CreateRedditAccountDto): Promise<RedditAccount> {
    const account = this.redditAccountRepository.create(createDto);
    await this.redditAccountRepository.save(account);
    this.logger.log(`Created Reddit account: ${account.username}`, 'RedditAccountService');
    return account;
  }

  async findAll(isActive?: boolean): Promise<RedditAccount[]> {
    const where = isActive !== undefined ? { isActive } : {};
    return this.redditAccountRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<RedditAccount> {
    const account = await this.redditAccountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Reddit account with ID ${id} not found`);
    }
    return account;
  }

  async findByUsername(username: string): Promise<RedditAccount | null> {
    return this.redditAccountRepository.findOne({ where: { username } });
  }

  async update(id: string, updateDto: UpdateRedditAccountDto): Promise<RedditAccount> {
    const account = await this.findOne(id);
    Object.assign(account, updateDto);
    await this.redditAccountRepository.save(account);
    this.logger.log(`Updated Reddit account: ${account.username}`, 'RedditAccountService');
    return account;
  }

  async updateSyncTime(id: string): Promise<void> {
    await this.redditAccountRepository.update(id, {
      lastSyncedAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    await this.redditAccountRepository.remove(account);
    this.logger.log(`Removed Reddit account: ${account.username}`, 'RedditAccountService');
  }

  async getActiveAccounts(): Promise<RedditAccount[]> {
    return this.redditAccountRepository.find({
      where: { isActive: true },
      order: { lastSyncedAt: 'ASC' },
    });
  }
}
