import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQueryTrackingsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  routing?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
