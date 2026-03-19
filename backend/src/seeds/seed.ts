import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { RedditAccount } from '../entities/reddit-account.entity';

const topFinanceAccounts = [
  {
    username: 'wallstreetbets',
    displayName: 'WallStreetBets',
    description: 'Like 4chan found a Bloomberg Terminal',
    category: 'Community',
    followersCount: 15000000,
  },
  {
    username: 'stocks',
    displayName: 'r/stocks',
    description: 'Stock market discussion and analysis',
    category: 'Investing',
    followersCount: 5000000,
  },
  {
    username: 'investing',
    displayName: 'r/investing',
    description: 'Investment strategies and portfolio discussion',
    category: 'Investing',
    followersCount: 2000000,
  },
  {
    username: 'options',
    displayName: 'r/options',
    description: 'Options trading strategies',
    category: 'Trading',
    followersCount: 800000,
  },
  {
    username: 'Daytrading',
    displayName: 'r/Daytrading',
    description: 'Day trading strategies and discussion',
    category: 'Trading',
    followersCount: 500000,
  },
  {
    username: 'SecurityAnalysis',
    displayName: 'r/SecurityAnalysis',
    description: 'Fundamental analysis and value investing',
    category: 'Analysis',
    followersCount: 300000,
  },
  {
    username: 'ValueInvesting',
    displayName: 'r/ValueInvesting',
    description: 'Value investing principles and strategies',
    category: 'Investing',
    followersCount: 250000,
  },
  {
    username: 'CryptoCurrency',
    displayName: 'r/CryptoCurrency',
    description: 'Cryptocurrency discussion and news',
    category: 'Crypto',
    followersCount: 7000000,
  },
];

async function seed() {
  const dataSource = new DataSource(typeOrmConfig);
  await dataSource.initialize();

  console.log('Seeding database...');

  const accountRepository = dataSource.getRepository(RedditAccount);

  for (const accountData of topFinanceAccounts) {
    const existing = await accountRepository.findOne({
      where: { username: accountData.username },
    });

    if (!existing) {
      const account = accountRepository.create(accountData);
      await accountRepository.save(account);
      console.log(`Created account: ${accountData.username}`);
    } else {
      console.log(`Account already exists: ${accountData.username}`);
    }
  }

  console.log('Seeding completed!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
