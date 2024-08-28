import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
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
