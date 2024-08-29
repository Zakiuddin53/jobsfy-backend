// src/modules/users/admin-users.controller.ts

import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('admin/users')
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Admin')
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'delete' })
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(+id);
    return { message: 'User deleted successfully' };
  }
}
