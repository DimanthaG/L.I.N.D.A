import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analysis')
@Controller('analysis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('sentiment')
  @ApiOperation({ summary: 'Get sentiment trends' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 200, description: 'Sentiment trends retrieved' })
  async getSentimentTrends(@Query('days') days?: number) {
    return this.analysisService.getSentimentTrends(days || 7);
  }

  @Get('tickers')
  @ApiOperation({ summary: 'Get trending tickers' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Trending tickers retrieved' })
  async getTrendingTickers(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ) {
    return this.analysisService.getTrendingTickers(days || 7, limit || 20);
  }

  @Get('sectors')
  @ApiOperation({ summary: 'Get sector distribution' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 200, description: 'Sector distribution retrieved' })
  async getSectorDistribution(@Query('days') days?: number) {
    return this.analysisService.getSectorDistribution(days || 7);
  }

  @Get('themes')
  @ApiOperation({ summary: 'Get trending themes' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 15 })
  @ApiResponse({ status: 200, description: 'Trending themes retrieved' })
  async getTrendingThemes(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ) {
    return this.analysisService.getTrendingThemes(days || 7, limit || 15);
  }
}
