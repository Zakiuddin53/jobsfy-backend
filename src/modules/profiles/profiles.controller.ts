import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  NotFoundException,
  Param,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profiles.service';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { Profile } from './entites/profile.entity';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/user.decorator';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get Single Profile' })
  async getSingle(@Param('id') id: string) {
    return this.profileService.findOneOrThrow(+id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get Own Profile' })
  async getOwnProfile(@User() user) {
    return this.profileService.findOneOrThrow(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Profile already exists',
  })
  async createProfile(
    @User() user,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const profile = await this.profileService.create(user.id, createProfileDto);
    return { statusCode: HttpStatus.CREATED, data: profile };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Profile' })
  async updateProfile(
    @Param('id') id: string,
    @User() user,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(+id, updateProfileDto);
  }
}
