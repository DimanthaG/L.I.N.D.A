import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RedditAccountService } from './reddit-account.service';
import { RedditService } from './reddit.service';
import { CreateRedditAccountDto } from './dto/create-reddit-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reddit')
@Controller('reddit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RedditController {
  constructor(
    private redditAccountService: RedditAccountService,
    private redditService: RedditService,
  ) {}

  @Get('accounts')
  @ApiOperation({ summary: 'Get all tracked Reddit accounts' })
  @ApiResponse({ status: 200, description: 'List of accounts' })
  async getAccounts(@Query('active') active?: boolean) {
    return this.redditAccountService.findAll(active);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get Reddit account by ID' })
  @ApiResponse({ status: 200, description: 'Account details' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getAccount(@Param('id') id: string) {
    return this.redditAccountService.findOne(id);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Add a new Reddit account to track' })
  @ApiResponse({ status: 201, description: 'Account created' })
  async createAccount(@Body() createDto: CreateRedditAccountDto) {
    return this.redditAccountService.create(createDto);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Remove a Reddit account from tracking' })
  @ApiResponse({ status: 200, description: 'Account removed' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async removeAccount(@Param('id') id: string) {
    await this.redditAccountService.remove(id);
    return { message: 'Account removed successfully' };
  }

  @Post('accounts/:id/sync')
  @ApiOperation({ summary: 'Sync posts for a specific account' })
  @ApiResponse({ status: 200, description: 'Posts synced' })
  async syncAccount(@Param('id') id: string) {
    const newPostsCount = await this.redditService.syncAccountPosts(id);
    return { message: 'Sync completed', newPosts: newPostsCount };
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Sync posts for all active accounts' })
  @ApiResponse({ status: 200, description: 'All accounts synced' })
  async syncAllAccounts() {
    const result = await this.redditService.syncAllAccounts();
    return result;
  }
}
