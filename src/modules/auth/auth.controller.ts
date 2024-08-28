import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { Public } from './decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log('Login route hit');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'register' })
  async register(@Body() registerBody: RegisterRequestDto) {
    return await this.authService.register(registerBody);
  }
}
