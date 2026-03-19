import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RedditService } from './reddit.service';
import { RedditApiService } from './reddit-api.service';
import { RedditAccountService } from './reddit-account.service';
import { RedditController } from './reddit.controller';
import { RedditAccount } from '../../entities/reddit-account.entity';
import { Post } from '../../entities/post.entity';
import { ApiRateLimit } from '../../entities/api-rate-limit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RedditAccount, Post, ApiRateLimit]),
    HttpModule,
  ],
  controllers: [RedditController],
  providers: [RedditService, RedditApiService, RedditAccountService],
  exports: [RedditService, RedditApiService, RedditAccountService],
})
export class RedditModule {}
