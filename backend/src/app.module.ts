import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedditModule } from './modules/reddit/reddit.module';
import { PostModule } from './modules/post/post.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { JobModule } from './modules/job/job.module';
import { LoggerModule } from './common/logger/logger.module';
import { CacheModule } from './common/cache/cache.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    CacheModule,
    AuthModule,
    UserModule,
    RedditModule,
    PostModule,
    AnalysisModule,
    StrategyModule,
    WatchlistModule,
    JobModule,
    HealthModule,
  ],
})
export class AppModule {}
