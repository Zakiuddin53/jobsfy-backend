// src/modules/profiles/dto/create-profile.dto.ts

import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  job?: string;

  @IsNumber()
  salary: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  positionLevel?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNumber()
  yearsOfExperience: number;

  @IsNumber()
  yearsAtCurrentCompany: number;

  @IsOptional()
  @IsString()
  gender?: string;
}
