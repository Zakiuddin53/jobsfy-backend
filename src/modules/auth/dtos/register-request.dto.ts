import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsIn,
  ValidateIf,
} from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsIn(['corporate', 'muslim-company', 'unemployed'])
  userType: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  firstName: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  lastName: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  gender: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  country: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  state: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  city: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  industry: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  companyName: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  level: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  department: string;

  @ValidateIf(
    (o) => o.userType === 'corporate' || o.userType === 'muslim-company',
  )
  @IsNotEmpty()
  title: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsNotEmpty()
  fieldOfStudy: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsNotEmpty()
  university: string;

  @ValidateIf((o) => o.userType === 'unemployed')
  @IsNotEmpty()
  @IsIn(['Intern', 'Entry Level', 'Manager', 'Director', 'VP'])
  lookingFor: string;
}
