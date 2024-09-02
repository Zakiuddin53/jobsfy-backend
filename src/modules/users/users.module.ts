import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AdminUsersController } from './admin-users.controller';
import { ProfileModule } from '../profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ProfileModule)],
  controllers: [UserController, AdminUsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
