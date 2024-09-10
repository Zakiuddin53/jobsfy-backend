import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { PaginatedSwaggerDocs, Paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './user.pagination-config';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entites/user.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @PaginatedSwaggerDocs(User, USER_PAGINATION_CONFIG)
  async paginate(@Paginate() query: PaginateQuery) {
    return this.userService.paginate(query);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get Current User' })
  async getCurrentUser(@Req() req) {
    return this.userService.findOneOrThrow(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
