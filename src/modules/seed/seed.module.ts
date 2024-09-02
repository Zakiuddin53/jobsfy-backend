// src/modules/seed/seed.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entites/user.entity';
import { SeedService } from './seed.service';
import { ProfileModule } from '../profiles/profiles.module';
import { Profile } from '../profiles/entites/profile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    forwardRef(() => ProfileModule),
    forwardRef(() => UsersModule),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
