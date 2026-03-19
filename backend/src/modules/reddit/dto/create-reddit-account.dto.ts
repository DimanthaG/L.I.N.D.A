import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRedditAccountDto {
  @ApiProperty({ example: 'wallstreetbets' })
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty({ example: 'WallStreetBets', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @ApiProperty({ example: 'Discussion about stocks and investing', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'stocks', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
