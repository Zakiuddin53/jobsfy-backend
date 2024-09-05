import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ProfileService } from '../profiles/profiles.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('charts')
@ApiTags('Charts')
@Public()
export class ChartController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('level-distribution')
  @ApiOperation({ summary: 'Level Distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company', 'unemployed', 'admin'],
  })
  async getLevelDistribution(@Query('userType') userType?: string) {
    return this.profileService.getLevelDistribution(userType);
  }

  @Get('gender-distribution')
  @ApiOperation({ summary: 'Gender Distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company', 'unemployed', 'admin'],
  })
  async getGenderDistribution(@Query('userType') userType?: string) {
    return this.profileService.getGenderDistribution(userType);
  }

  @Get('company-distribution')
  @ApiOperation({ summary: 'Company Distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company', 'unemployed', 'admin'],
  })
  async getCompanyDistribution(@Query('userType') userType?: string) {
    return this.profileService.getCompanyDistribution(userType);
  }

  @Get('department-distribution')
  @ApiOperation({ summary: 'Departement Distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company', 'unemployed'],
  })
  async getDepartementDistribution(@Query('userType') userType?: string) {
    return this.profileService.getDepartementDistribution(userType);
  }
}
