import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTickerDto {
  @ApiProperty({ example: 'AAPL' })
  @IsString()
  @MaxLength(20)
  ticker: string;

  @ApiProperty({ example: 'Watching for Q4 earnings', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
