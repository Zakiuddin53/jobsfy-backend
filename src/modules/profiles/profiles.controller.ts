import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  UseGuards,
  NotFoundException,
  Param,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profiles.service';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { Profile } from './entites/profile.entity';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('profile')
@UseGuards(JwtGuard)
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Profiles' })
  @PaginatedSwaggerDocs(Profile, PROFILE_PAGINATION_CONFIG)
  async paginate(@Paginate() query: PaginateQuery) {
    return this.profileService.paginate(query);
  }

  @ApiOperation({ summary: 'Get Single' })
  @Get(':id')
  getSingle(@Param('id') id: string) {
    return this.profileService.findOneOrThrow(+id);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create Profile' })
  async createProfile(
    @Param('userId') userId: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.profileService.createOrUpdateProfile(+userId, profileDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User Profile' })
  async updateProfile(
    @Param('id') id: string,
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (userId !== parseInt(id)) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.profileService.createOrUpdateProfile(userId, updateProfileDto);
  }
}
