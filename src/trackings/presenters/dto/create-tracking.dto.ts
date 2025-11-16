import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContainerDto } from './create-containers.dto';
import { CreateSealDto } from './create-seals.dto';
import { IsValidContainerCodeConstraint } from '@trackings/infrastructure/decorators/is-valid-container-code.decorator';

export class CreateTrackingDto {
  @IsNumber()
  consignee: number;

  @IsNumber()
  notifier: number;

  @IsString()
  @IsNotEmpty()
  shipper: string;

  @IsString()
  @IsNotEmpty()
  routing: string;

  @IsString()
  @IsNotEmpty()
  customsOffice: string;

  @IsString()
  @IsNotEmpty()
  blAuthorization: string;

  @IsString()
  @IsNotEmpty()
  regime: string;

  @IsString()
  @IsNotEmpty()
  mbl_mawb: string;

  @IsString()
  @IsNotEmpty()
  hbl_mawb: string;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  etd: Date;

  @IsDateString()
  eta: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContainerDto)
  containers: CreateContainerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSealDto)
  @Validate(IsValidContainerCodeConstraint)
  seals: CreateSealDto[];

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
