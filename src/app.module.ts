import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profiles/profiles.module';
import { UsersModule } from './modules/users/users.module';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { PassportModule } from '@nestjs/passport';
import { SeedModule } from './modules/seed/seed.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions-filters/all-exceptions.filter';
import { BadRequestErrorFilter } from './exceptions-filters/bad-request-error.filter';

@Module({
  imports: [
    ProfileModule,
    UsersModule,
    AuthModule,

    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER_NAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: BadRequestErrorFilter,
    // },
  ],
})
export class AppModule {}
