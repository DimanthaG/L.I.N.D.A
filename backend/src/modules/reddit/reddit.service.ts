import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedditApiService } from './reddit-api.service';
import { RedditAccountService } from './reddit-account.service';
import { Post } from '../../entities/post.entity';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class RedditService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private redditApiService: RedditApiService,
    private redditAccountService: RedditAccountService,
    private logger: LoggerService,
  ) {}

  async syncAccountPosts(accountId: string): Promise<number> {
    const account = await this.redditAccountService.findOne(accountId);

    try {
      const redditPosts = await this.redditApiService.getUserPosts(account.username);

      let newPostsCount = 0;

      for (const redditPost of redditPosts) {
        const existingPost = await this.postRepository.findOne({
          where: { postId: redditPost.id },
        });

        if (!existingPost) {
          const engagementScore = this.calculateEngagementScore(
            redditPost.ups || 0,
            redditPost.num_comments || 0,
            redditPost.total_awards_received || 0,
          );

          const post = this.postRepository.create({
            accountId: account.id,
            postId: redditPost.id,
            content: redditPost.selftext || redditPost.title || '',
            postedAt: new Date(redditPost.created_utc * 1000),
            upvotes: redditPost.ups || 0,
            commentsCount: redditPost.num_comments || 0,
            awardsCount: redditPost.total_awards_received || 0,
            engagementScore,
            url: `https://reddit.com${redditPost.permalink}`,
            mediaUrls: this.extractMediaUrls(redditPost),
          });

          await this.postRepository.save(post);
          newPostsCount++;
        }
      }

      await this.redditAccountService.updateSyncTime(accountId);

      this.logger.log(
        `Synced ${newPostsCount} new posts for ${account.username}`,
        'RedditService',
      );

      return newPostsCount;
    } catch (error) {
      this.logger.error(
        `Failed to sync posts for ${account.username}`,
        error.stack,
        'RedditService',
      );
      throw error;
    }
  }

  async syncAllAccounts(): Promise<{ total: number; synced: number; failed: number }> {
    const accounts = await this.redditAccountService.getActiveAccounts();

    let synced = 0;
    let failed = 0;

    for (const account of accounts) {
      try {
        await this.syncAccountPosts(account.id);
        synced++;
      } catch (error) {
        failed++;
        this.logger.error(
          `Failed to sync account ${account.username}`,
          error.stack,
          'RedditService',
        );
      }
    }

    return { total: accounts.length, synced, failed };
  }

  private calculateEngagementScore(
    upvotes: number,
    comments: number,
    awards: number,
  ): number {
    return upvotes * 1.0 + comments * 2.0 + awards * 5.0;
  }

  private extractMediaUrls(redditPost: any): string[] {
    const urls: string[] = [];

    if (redditPost.url && this.isMediaUrl(redditPost.url)) {
      urls.push(redditPost.url);
    }

    if (redditPost.media?.oembed?.thumbnail_url) {
      urls.push(redditPost.media.oembed.thumbnail_url);
    }

    if (redditPost.preview?.images) {
      redditPost.preview.images.forEach((image: any) => {
        if (image.source?.url) {
          urls.push(image.source.url);
        }
      });
    }

    return urls;
  }

  private isMediaUrl(url: string): boolean {
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm'];
    return mediaExtensions.some((ext) => url.toLowerCase().includes(ext));
  }
}
