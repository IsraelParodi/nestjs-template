import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQuerySeaPortsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  unlocode?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
