import { Injectable } from '@nestjs/common';
import * as Sentiment from 'sentiment';
import { Sentiment as SentimentEnum, ConvictionLevel } from '../../entities/post-analysis.entity';

interface SentimentResult {
  sentiment: SentimentEnum;
  sentimentScore: number;
  convictionLevel: ConvictionLevel;
  convictionScore: number;
}

@Injectable()
export class SentimentService {
  private sentimentAnalyzer: any;

  constructor() {
    this.sentimentAnalyzer = new Sentiment();
  }

  analyzeSentiment(text: string): SentimentResult {
    const result = this.sentimentAnalyzer.analyze(text);

    const normalizedScore = this.normalizeScore(result.score, result.tokens.length);

    const sentiment = this.determineSentiment(normalizedScore);
    const convictionScore = Math.abs(normalizedScore);
    const convictionLevel = this.determineConviction(convictionScore);

    return {
      sentiment,
      sentimentScore: normalizedScore,
      convictionLevel,
      convictionScore,
    };
  }

  private normalizeScore(rawScore: number, tokenCount: number): number {
    if (tokenCount === 0) return 0;

    const normalizedScore = rawScore / Math.sqrt(tokenCount);

    return Math.max(-1, Math.min(1, normalizedScore / 5));
  }

  private determineSentiment(score: number): SentimentEnum {
    if (score > 0.15) return SentimentEnum.BULLISH;
    if (score < -0.15) return SentimentEnum.BEARISH;
    return SentimentEnum.NEUTRAL;
  }

  private determineConviction(score: number): ConvictionLevel {
    if (score >= 0.6) return ConvictionLevel.HIGH;
    if (score >= 0.3) return ConvictionLevel.MEDIUM;
    return ConvictionLevel.LOW;
  }

  detectConvictionSignals(text: string): { hasConviction: boolean; signals: string[] } {
    const highConvictionPhrases = [
      'all in',
      'buying more',
      'loading up',
      'conviction buy',
      'high conviction',
      'strong buy',
      'accumulating',
      'doubling down',
      'very bullish',
      'extremely bullish',
      'very bearish',
      'extremely bearish',
      'shorting',
      'puts',
      'calls',
    ];

    const lowerText = text.toLowerCase();
    const foundSignals = highConvictionPhrases.filter((phrase) =>
      lowerText.includes(phrase),
    );

    return {
      hasConviction: foundSignals.length > 0,
      signals: foundSignals,
    };
  }
}
