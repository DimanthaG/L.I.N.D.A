import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get posts with filters' })
  @ApiQuery({ name: 'accountIds', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'sentiment', required: false, type: String })
  @ApiQuery({ name: 'tickers', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, description: 'Posts retrieved' })
  async getPosts(
    @Query('accountIds') accountIds?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sentiment') sentiment?: string,
    @Query('tickers') tickers?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const filters = {
      accountIds: accountIds ? accountIds.split(',') : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      sentiment,
      tickers: tickers ? tickers.split(',') : undefined,
      limit,
      offset,
    };

    return this.postService.findAll(filters);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top engaging posts' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Top posts retrieved' })
  async getTopPosts(@Query('days') days?: number, @Query('limit') limit?: number) {
    return this.postService.getTopEngagingPosts(days || 7, limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post details' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPost(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get posts by account' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Account posts retrieved' })
  async getPostsByAccount(
    @Param('accountId') accountId: string,
    @Query('limit') limit?: number,
  ) {
    return this.postService.getPostsByAccount(accountId, limit || 50);
  }
}
