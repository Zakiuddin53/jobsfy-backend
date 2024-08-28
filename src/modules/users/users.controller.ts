import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { PaginatedSwaggerDocs, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Profile } from '../profiles/entites/profile.entity';
import { USER_PAGINATION_CONFIG } from './user.pagination-config';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get All' })
  @PaginatedSwaggerDocs(Profile, USER_PAGINATION_CONFIG)
  async paginate(@Paginate() query: PaginateQuery) {
    return this.userService.paginate(query);
  }
}
