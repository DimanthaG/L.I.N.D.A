import { Injectable } from '@nestjs/common';

interface ThemeExtraction {
  themes: string[];
  macroSignals: string[];
  keyPhrases: string[];
  isActionable: boolean;
}

@Injectable()
export class ThemeService {
  private readonly themeKeywords = {
    'AI/Tech': ['ai', 'artificial intelligence', 'machine learning', 'tech', 'semiconductor', 'chip'],
    'Inflation': ['inflation', 'cpi', 'pce', 'deflation', 'price pressure'],
    'Interest Rates': ['fed', 'federal reserve', 'interest rate', 'rate cut', 'rate hike', 'fomc'],
    'Earnings': ['earnings', 'eps', 'revenue', 'guidance', 'beat', 'miss', 'report'],
    'M&A': ['merger', 'acquisition', 'takeover', 'buyout', 'deal'],
    'IPO': ['ipo', 'initial public offering', 'going public', 'listing'],
    'Crypto': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'btc', 'eth'],
    'Energy': ['oil', 'gas', 'energy', 'crude', 'opec', 'renewable'],
    'Real Estate': ['real estate', 'housing', 'mortgage', 'reit', 'property'],
    'Banking': ['bank', 'banking', 'credit', 'loan', 'deposit'],
    'Recession': ['recession', 'downturn', 'bear market', 'crash', 'correction'],
    'Growth': ['growth', 'expansion', 'bull market', 'rally', 'breakout'],
    'Value': ['value', 'undervalued', 'cheap', 'discount', 'bargain'],
    'Dividend': ['dividend', 'yield', 'payout', 'income'],
    'Short Squeeze': ['short squeeze', 'gamma squeeze', 'short interest'],
    'Options': ['options', 'calls', 'puts', 'strike', 'expiry'],
  };

  private readonly macroKeywords = {
    'Fed Policy': ['fed', 'federal reserve', 'powell', 'fomc', 'monetary policy'],
    'GDP': ['gdp', 'economic growth', 'recession', 'expansion'],
    'Employment': ['jobs', 'unemployment', 'labor market', 'payroll', 'jobless'],
    'Consumer Spending': ['consumer spending', 'retail sales', 'consumption'],
    'Trade': ['trade war', 'tariff', 'export', 'import', 'trade deficit'],
    'Geopolitics': ['war', 'conflict', 'sanctions', 'geopolitical', 'china', 'russia'],
    'Dollar': ['dollar', 'dxy', 'currency', 'forex', 'exchange rate'],
    'Yields': ['yield', 'treasury', 'bond', '10-year', 'yield curve'],
  };

  private readonly actionableKeywords = [
    'buy', 'sell', 'long', 'short', 'entry', 'exit', 'target', 'stop loss',
    'accumulate', 'trim', 'add', 'reduce', 'position', 'trade',
  ];

  extractThemes(text: string): ThemeExtraction {
    const lowerText = text.toLowerCase();
    const themes = new Set<string>();
    const macroSignals = new Set<string>();
    const keyPhrases: string[] = [];

    Object.entries(this.themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        themes.add(theme);
      }
    });

    Object.entries(this.macroKeywords).forEach(([signal, keywords]) => {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        macroSignals.add(signal);
      }
    });

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    keyPhrases.push(...sentences.slice(0, 3).map((s) => s.trim()));

    const isActionable = this.actionableKeywords.some((keyword) =>
      lowerText.includes(keyword),
    );

    return {
      themes: Array.from(themes),
      macroSignals: Array.from(macroSignals),
      keyPhrases,
      isActionable,
    };
  }
}
