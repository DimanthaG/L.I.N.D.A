import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('strategy')
@Controller('strategy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StrategyController {
  constructor(private strategyService: StrategyService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current investment strategy' })
  @ApiResponse({ status: 200, description: 'Current strategy retrieved' })
  async getCurrentStrategy() {
    return this.strategyService.getCurrentStrategy();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get strategy history' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Strategy history retrieved' })
  async getStrategyHistory(@Query('limit') limit?: number) {
    return this.strategyService.getStrategyHistory(limit || 10);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new strategy report' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 201, description: 'Strategy generated' })
  async generateStrategy(@Query('days') days?: number) {
    return this.strategyService.generateStrategy(days || 7);
  }

  @Post('save/:strategyId')
  @ApiOperation({ summary: 'Save a strategy to user favorites' })
  @ApiResponse({ status: 201, description: 'Strategy saved' })
  async saveStrategy(
    @CurrentUser() user: User,
    @Param('strategyId') strategyId: string,
    @Body('notes') notes?: string,
  ) {
    return this.strategyService.saveStrategyForUser(user.id, strategyId, notes);
  }

  @Get('saved')
  @ApiOperation({ summary: 'Get user saved strategies' })
  @ApiResponse({ status: 200, description: 'Saved strategies retrieved' })
  async getSavedStrategies(@CurrentUser() user: User) {
    return this.strategyService.getUserSavedStrategies(user.id);
  }
}
