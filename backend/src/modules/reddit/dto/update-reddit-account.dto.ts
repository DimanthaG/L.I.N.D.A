import { PartialType } from '@nestjs/swagger';
import { CreateRedditAccountDto } from './create-reddit-account.dto';

export class UpdateRedditAccountDto extends PartialType(CreateRedditAccountDto) {}
