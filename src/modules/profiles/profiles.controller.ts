import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profiles.service';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { Profile } from './entites/profile.entity';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get All' })
  @PaginatedSwaggerDocs(Profile, PROFILE_PAGINATION_CONFIG)
  async paginate(@Paginate() query: PaginateQuery) {
    return this.profileService.paginate(query);
  }
}
