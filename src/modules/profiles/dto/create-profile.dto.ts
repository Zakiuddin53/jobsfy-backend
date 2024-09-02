import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  fieldOfStudy?: string;

  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  lookingFor?: string;

  @IsString()
  @IsOptional()
  positionLevel?: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsString()
  @IsOptional()
  division?: string;

  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  job?: string;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @IsNumber()
  @IsOptional()
  yearsAtCurrentCompany?: number;
}
