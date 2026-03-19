import { IsString, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWatchlistDto {
  @ApiProperty({ example: 'My Tech Watchlist' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Tracking tech stocks and crypto', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
  @IsOptional()
  @IsArray()
  accountIds?: string[];

  @ApiProperty({ example: ['AAPL', 'TSLA'], required: false })
  @IsOptional()
  @IsArray()
  tickers?: string[];
}
