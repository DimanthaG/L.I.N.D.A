import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('admin', 'analyst', 'user');
      CREATE TYPE sentiment_enum AS ENUM ('bullish', 'bearish', 'neutral');
      CREATE TYPE conviction_level_enum AS ENUM ('high', 'medium', 'low');
      CREATE TYPE job_status_enum AS ENUM ('pending', 'active', 'completed', 'failed', 'delayed');
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role user_role_enum DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login_at TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE reddit_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        account_id VARCHAR(100),
        description TEXT,
        followers_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        last_synced_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        account_id UUID REFERENCES reddit_accounts(id) ON DELETE CASCADE,
        post_id VARCHAR(100) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        posted_at TIMESTAMP NOT NULL,
        upvotes INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        awards_count INTEGER DEFAULT 0,
        engagement_score DECIMAL(10, 2),
        url TEXT,
        media_urls TEXT[],
        is_analyzed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE post_analysis (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
        sentiment sentiment_enum NOT NULL,
        sentiment_score DECIMAL(5, 4),
        conviction_level conviction_level_enum,
        conviction_score DECIMAL(5, 4),
        tickers TEXT[],
        sectors TEXT[],
        themes TEXT[],
        macro_signals TEXT[],
        key_phrases TEXT[],
        is_actionable BOOLEAN DEFAULT false,
        analyzed_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE ticker_mentions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticker VARCHAR(20) NOT NULL,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        mention_count INTEGER DEFAULT 1,
        context TEXT,
        sentiment sentiment_enum,
        mentioned_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE strategies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        bullish_ideas JSONB,
        bearish_risks JSONB,
        trending_opportunities JSONB,
        consensus_signals JSONB,
        confidence_score DECIMAL(5, 4),
        time_period VARCHAR(50),
        post_count INTEGER,
        account_count INTEGER,
        generated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE watchlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE watchlist_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
        account_id UUID REFERENCES reddit_accounts(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(watchlist_id, account_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE watchlist_tickers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
        ticker VARCHAR(20) NOT NULL,
        notes TEXT,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(watchlist_id, ticker)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE user_saved_strategies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
        notes TEXT,
        saved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, strategy_id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE api_rate_limits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        endpoint VARCHAR(255) NOT NULL,
        remaining_calls INTEGER,
        reset_at TIMESTAMP,
        last_called_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE job_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_name VARCHAR(255) NOT NULL,
        job_id VARCHAR(255),
        status job_status_enum NOT NULL,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        error_message TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
      CREATE INDEX idx_reddit_accounts_username ON reddit_accounts(username);
      CREATE INDEX idx_reddit_accounts_category ON reddit_accounts(category);
      CREATE INDEX idx_reddit_accounts_active ON reddit_accounts(is_active);
      CREATE INDEX idx_posts_account_id ON posts(account_id);
      CREATE INDEX idx_posts_posted_at ON posts(posted_at DESC);
      CREATE INDEX idx_posts_post_id ON posts(post_id);
      CREATE INDEX idx_posts_is_analyzed ON posts(is_analyzed);
      CREATE INDEX idx_posts_engagement ON posts(engagement_score DESC);
      CREATE INDEX idx_post_analysis_post_id ON post_analysis(post_id);
      CREATE INDEX idx_post_analysis_sentiment ON post_analysis(sentiment);
      CREATE INDEX idx_post_analysis_tickers ON post_analysis USING GIN(tickers);
      CREATE INDEX idx_post_analysis_sectors ON post_analysis USING GIN(sectors);
      CREATE INDEX idx_post_analysis_analyzed_at ON post_analysis(analyzed_at DESC);
      CREATE INDEX idx_ticker_mentions_ticker ON ticker_mentions(ticker);
      CREATE INDEX idx_ticker_mentions_post_id ON ticker_mentions(post_id);
      CREATE INDEX idx_ticker_mentions_mentioned_at ON ticker_mentions(mentioned_at DESC);
      CREATE INDEX idx_ticker_mentions_ticker_date ON ticker_mentions(ticker, mentioned_at DESC);
      CREATE INDEX idx_strategies_generated_at ON strategies(generated_at DESC);
      CREATE INDEX idx_strategies_confidence ON strategies(confidence_score DESC);
      CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
      CREATE INDEX idx_watchlist_accounts_watchlist ON watchlist_accounts(watchlist_id);
      CREATE INDEX idx_watchlist_accounts_account ON watchlist_accounts(account_id);
      CREATE INDEX idx_watchlist_tickers_watchlist ON watchlist_tickers(watchlist_id);
      CREATE INDEX idx_watchlist_tickers_ticker ON watchlist_tickers(ticker);
      CREATE INDEX idx_user_saved_strategies_user ON user_saved_strategies(user_id);
      CREATE INDEX idx_user_saved_strategies_strategy ON user_saved_strategies(strategy_id);
      CREATE INDEX idx_api_rate_limits_endpoint ON api_rate_limits(endpoint);
      CREATE INDEX idx_job_logs_job_name ON job_logs(job_name);
      CREATE INDEX idx_job_logs_status ON job_logs(status);
      CREATE INDEX idx_job_logs_created_at ON job_logs(created_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS job_logs CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS api_rate_limits CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_saved_strategies CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS watchlist_tickers CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS watchlist_accounts CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS watchlists CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS strategies CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ticker_mentions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS post_analysis CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS posts CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS reddit_accounts CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS job_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS conviction_level_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sentiment_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum;`);
  }
}
