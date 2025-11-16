import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationQueryUsersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsNumberString()
  roleId?: string;
}
