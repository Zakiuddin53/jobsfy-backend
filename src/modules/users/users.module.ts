import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AdminUsersController } from './admin-users.controller';
import { Corporate } from './entites/corporate.entity';
import { MuslimCompany } from './entites/muslim-company.entity';
import { Unemployed } from './entites/unemployed.entity';
import { ChartController } from './charts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Corporate, MuslimCompany, Unemployed]),
  ],
  controllers: [UserController, AdminUsersController, ChartController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
