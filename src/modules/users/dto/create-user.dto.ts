import { IsString, IsNotEmpty, ValidateIf, IsIn } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['male', 'female'])
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

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsString()
  @IsNotEmpty()
  level: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsString()
  @IsNotEmpty()
  department: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsString()
  @IsNotEmpty()
  fieldOfStudy: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsString()
  @IsNotEmpty()
  university: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsString()
  @IsNotEmpty()
  @IsIn(['Intern', 'Entry Level', 'Manager', 'Director', 'VP'])
  lookingFor: string;
}
