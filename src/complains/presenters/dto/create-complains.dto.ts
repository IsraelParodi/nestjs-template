import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Max, Min } from 'class-validator';

import { IsNationalTaxpayerRegistryValid } from '@complains/infrastructure/decorators/complains-nation-taxpayer-registry.decorator';

export class CreateComplainsDto {
  @IsString()
  @IsNotEmpty()
  @IsNationalTaxpayerRegistryValid()
  nationalTaxpayerRegistry: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  @Min(1)
  documentType: number;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  complainerName: string;

  @IsString()
  @IsNotEmpty()
  complainerAddress: string;

  @IsString()
  @IsNotEmpty()
  complainerDistrict: string;

  @IsString()
  @IsNotEmpty()
  complainerPhone: string;

  @IsString()
  @IsNotEmpty()
  complainerPhoneCode: string;

  @IsEmail()
  complainerEmail: string;

  @IsNumber()
  @Min(1)
  @Max(5340)
  complainerState: number;

  @IsNumber()
  @Min(1)
  @Max(250)
  complainerCountry: number;

  @IsNumber()
  @Min(1)
  serviceType: number;

  @IsNumber()
  @Min(1)
  currency: number;

  @IsNumber()
  @Min(0)
  amountComplained: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  type: number;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsString()
  @IsNotEmpty()
  request: string;

  @IsString({ each: true })
  @IsNotEmpty()
  emailsCopied: string[];

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
