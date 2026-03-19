import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { AddTickerDto } from './dto/add-ticker.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('watchlists')
@Controller('watchlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user watchlists' })
  @ApiResponse({ status: 200, description: 'Watchlists retrieved' })
  async getWatchlists(@CurrentUser() user: User) {
    return this.watchlistService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get watchlist by ID' })
  @ApiResponse({ status: 200, description: 'Watchlist retrieved' })
  @ApiResponse({ status: 404, description: 'Watchlist not found' })
  async getWatchlist(@Param('id') id: string) {
    return this.watchlistService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new watchlist' })
  @ApiResponse({ status: 201, description: 'Watchlist created' })
  async createWatchlist(
    @CurrentUser() user: User,
    @Body() createDto: CreateWatchlistDto,
  ) {
    return this.watchlistService.create(user.id, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update watchlist' })
  @ApiResponse({ status: 200, description: 'Watchlist updated' })
  @ApiResponse({ status: 404, description: 'Watchlist not found' })
  async updateWatchlist(
    @Param('id') id: string,
    @Body() updateDto: UpdateWatchlistDto,
  ) {
    return this.watchlistService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete watchlist' })
  @ApiResponse({ status: 200, description: 'Watchlist deleted' })
  @ApiResponse({ status: 404, description: 'Watchlist not found' })
  async deleteWatchlist(@Param('id') id: string) {
    await this.watchlistService.remove(id);
    return { message: 'Watchlist deleted successfully' };
  }

  @Post(':id/tickers')
  @ApiOperation({ summary: 'Add ticker to watchlist' })
  @ApiResponse({ status: 201, description: 'Ticker added' })
  async addTicker(@Param('id') id: string, @Body() addTickerDto: AddTickerDto) {
    return this.watchlistService.addTicker(id, addTickerDto.ticker, addTickerDto.notes);
  }

  @Delete(':id/tickers/:ticker')
  @ApiOperation({ summary: 'Remove ticker from watchlist' })
  @ApiResponse({ status: 200, description: 'Ticker removed' })
  async removeTicker(@Param('id') id: string, @Param('ticker') ticker: string) {
    await this.watchlistService.removeTicker(id, ticker);
    return { message: 'Ticker removed successfully' };
  }
}
