import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQueryQuotationsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastname?: string;
}
