// create-user.dto.ts
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsObject,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BaseUserDto } from './base-user.dto';
import { CorporateUserDto } from './corporate-user.dto';
import { UnemployedUserDto } from './unemployed-user.dto';
import { MuslimCompanyUserDto } from './muslim-company-user.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['corporate', 'muslim-company', 'unemployed'])
  userType: string;

  @ValidateIf((o) => o.userType === 'corporate')
  @ValidateNested()
  @Type(() => CorporateUserDto)
  corporate?: CorporateUserDto;

  @ValidateIf((o) => o.userType === 'muslim-company')
  @ValidateNested()
  @Type(() => MuslimCompanyUserDto)
  muslimCompany?: MuslimCompanyUserDto;

  @ValidateIf((o) => o.userType === 'unemployed')
  @ValidateNested()
  @Type(() => UnemployedUserDto)
  unemployed?: UnemployedUserDto;
}
