import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UserService } from '../users/users.service';
import { ProfileService } from '../profiles/profiles.service';
import { AuthenticatedUserDto } from './dtos/authenticate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private profileService: ProfileService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserDto> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result as AuthenticatedUserDto;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterRequestDto) {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Create an empty profile for the new user
    await this.profileService.createOrUpdateProfile(newUser.id, {});

    return this.login(newUser);
  }
}
