import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { AuthenticatedUserDto } from './dtos/authenticate-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    return {
      id: result.id,
      email: result.email,
      role: result.role,
      userType: result.userType,
    };
  }

  async login(user: any) {
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.userType,
    );
    await this.usersService.setRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async register(registerDto: CreateUserDto) {
    const newUser = await this.usersService.create(registerDto);
    return this.login(newUser);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.userType,
    );
    await this.usersService.setRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(
    userId: number,
    email: string,
    role: string,
    userType: string,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          userType,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          userType,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
