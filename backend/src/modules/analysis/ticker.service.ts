import { Injectable } from '@nestjs/common';

interface TickerExtraction {
  tickers: string[];
  sectors: string[];
  context: Map<string, string>;
}

@Injectable()
export class TickerService {
  private readonly tickerPattern = /\$([A-Z]{1,5})\b|\b([A-Z]{2,5})\b(?=\s|$|[.,!?])/g;

  private readonly commonWords = new Set([
    'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER',
    'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW',
    'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID',
    'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'USA', 'CEO', 'IPO',
    'ETF', 'ATH', 'ATL', 'YTD', 'EOD', 'AMA', 'IMO', 'TBH', 'FOMO', 'YOLO',
  ]);

  private readonly sectorMap: { [key: string]: string } = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'TSLA': 'Automotive',
    'NVDA': 'Technology',
    'META': 'Technology',
    'JPM': 'Financial Services',
    'BAC': 'Financial Services',
    'GS': 'Financial Services',
    'XOM': 'Energy',
    'CVX': 'Energy',
    'JNJ': 'Healthcare',
    'PFE': 'Healthcare',
    'UNH': 'Healthcare',
    'WMT': 'Consumer Defensive',
    'PG': 'Consumer Defensive',
    'KO': 'Consumer Defensive',
    'DIS': 'Communication Services',
    'NFLX': 'Communication Services',
    'BA': 'Industrials',
    'CAT': 'Industrials',
  };

  extractTickers(text: string): TickerExtraction {
    const tickers = new Set<string>();
    const context = new Map<string, string>();

    const matches = text.matchAll(this.tickerPattern);

    for (const match of matches) {
      const ticker = (match[1] || match[2]).toUpperCase();

      if (this.isValidTicker(ticker)) {
        tickers.add(ticker);

        const startIndex = Math.max(0, match.index - 50);
        const endIndex = Math.min(text.length, match.index + 50);
        const tickerContext = text.substring(startIndex, endIndex).trim();
        context.set(ticker, tickerContext);
      }
    }

    const tickerArray = Array.from(tickers);
    const sectors = this.getSectorsForTickers(tickerArray);

    return {
      tickers: tickerArray,
      sectors,
      context,
    };
  }

  private isValidTicker(ticker: string): boolean {
    if (ticker.length < 1 || ticker.length > 5) return false;

    if (this.commonWords.has(ticker)) return false;

    if (ticker.length === 1) return false;

    return true;
  }

  private getSectorsForTickers(tickers: string[]): string[] {
    const sectors = new Set<string>();

    tickers.forEach((ticker) => {
      const sector = this.sectorMap[ticker];
      if (sector) {
        sectors.add(sector);
      } else {
        sectors.add('Unknown');
      }
    });

    return Array.from(sectors);
  }

  getSectorForTicker(ticker: string): string {
    return this.sectorMap[ticker] || 'Unknown';
  }
}
