import { IsShippingTypeValid } from '@quotations/infrastructure/decorators/shipping-type.decorator';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, IsNumberString } from 'class-validator';

export class CreateQuotationsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  userType: string;

  @IsNumber()
  @Min(1)
  @Max(250)
  country: number;

  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  phoneCode: string;

  @IsNumberString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  transportType: string;

  @IsShippingTypeValid()
  shippingType: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  cargoVolume: number;

  @IsString()
  @IsOptional()
  containerCode: string;

  @IsString()
  @IsNotEmpty()
  industryType: string;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
