import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  start: number;
}
