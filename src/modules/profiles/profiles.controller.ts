import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
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
  @ApiOperation({ summary: 'Get All' })
  @PaginatedSwaggerDocs(Profile, PROFILE_PAGINATION_CONFIG)
  async paginate(@Paginate() query: PaginateQuery) {
    return this.profileService.paginate(query);
  }

  @Post()
  async createOrUpdateProfile(
    @Req() req,
    @Body() profileDto: CreateProfileDto,
  ) {
    const userId = req.user.id;
    return this.profileService.createOrUpdateProfile(userId, profileDto);
  }

  @Put()
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.createOrUpdateProfile(userId, updateProfileDto);
  }
}
