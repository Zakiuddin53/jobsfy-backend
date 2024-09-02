import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { LocalStrategy } from './strategy/local.strategy';
import { ProfileModule } from '../profiles/profiles.module';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
    RefreshTokenGuard,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
