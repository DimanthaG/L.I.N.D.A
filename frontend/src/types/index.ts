export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface RedditAccount {
  id: string;
  username: string;
  displayName?: string;
  description?: string;
  followersCount: number;
  isVerified: boolean;
  category?: string;
  isActive: boolean;
  lastSyncedAt?: string;
}

export interface Post {
  id: string;
  postId: string;
  content: string;
  postedAt: string;
  upvotes: number;
  commentsCount: number;
  awardsCount: number;
  engagementScore: number;
  url?: string;
  mediaUrls: string[];
  isAnalyzed: boolean;
  account: RedditAccount;
  analysis?: PostAnalysis;
}

export interface PostAnalysis {
  id: string;
  postId: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  convictionLevel?: 'high' | 'medium' | 'low';
  convictionScore?: number;
  tickers: string[];
  sectors: string[];
  themes: string[];
  macroSignals: string[];
  keyPhrases: string[];
  isActionable: boolean;
  analyzedAt: string;
}

export interface Strategy {
  id: string;
  title: string;
  summary?: string;
  bullishIdeas: any[];
  bearishRisks: any[];
  trendingOpportunities: any[];
  consensusSignals: any[];
  confidenceScore: number;
  timePeriod?: string;
  postCount?: number;
  accountCount?: number;
  generatedAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  accounts: RedditAccount[];
  tickers: WatchlistTicker[];
  createdAt: string;
}

export interface WatchlistTicker {
  id: string;
  ticker: string;
  notes?: string;
  addedAt: string;
}

export interface TickerTrend {
  ticker: string;
  mentionCount: number;
  postCount: number;
  avgSentiment: number;
}

export interface SentimentTrend {
  sentiment: string;
  count: number;
  avgScore: number;
}

export interface SectorData {
  sector: string;
  count: number;
}

export interface ThemeData {
  theme: string;
  count: number;
}
