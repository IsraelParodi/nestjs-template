import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateContactUsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsNumber()
  @Min(1)
  @Max(250)
  country: number;

  @IsString()
  phoneCode: string;

  @IsNumberString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsBoolean()
  acceptPrivacyPolicies: boolean;

  @IsOptional()
  @IsBoolean()
  receiveAdditionalInformation?: boolean;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
