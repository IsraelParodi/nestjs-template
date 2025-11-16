import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['createdBy']) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
