import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy validate called with email:', email);
    try {
      const user = await this.authService.validateUser(email, password);
      console.log('User validation result:', user ? 'Success' : 'Failed');
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.error('Error in LocalStrategy validate:', error);
      throw error;
    }
  }
}
