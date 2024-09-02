import { IsEmail, IsString, IsNotEmpty, IsIn } from 'class-validator';

export class BaseUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['corporate', 'muslim-company', 'unemployed'])
  userType: string;
}
