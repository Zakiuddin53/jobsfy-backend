import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/AccessToken';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UserService } from '../users/users.service';
import { User } from '../users/entites/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    console.log('AuthService validateUser called with email:', email);
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      throw new UnauthorizedException('User not found');
    }
    console.log('User found, comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('User validated successfully');
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    console.log('Password before hashing:', user.password);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create new user without profile
    const newUser: Omit<User, 'id' | 'profile'> = {
      username: user.username,
      email: user.email,
      password: hashedPassword,
    };

    const createdUser = await this.usersService.create(newUser);
    return this.login(createdUser);
  }
}
