import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../profiles/profiles.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('charts')
@UseGuards(JwtGuard)
@ApiTags('Charts')
export class ChartController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('industry-distribution')
  @ApiOperation({ summary: 'Industry Distribution' })
  async getIndustryDistribution() {
    return this.profileService.getIndustryDistribution();
  }

  @Get('experience-overview')
  @ApiOperation({ summary: 'Experience Overview' })
  async getExperienceOverview() {
    return this.profileService.getExperienceOverview();
  }

  @Get('level-distribution')
  @ApiOperation({ summary: 'level distribution' })
  async getLevelDistribution() {
    return this.profileService.getLevelDistribution();
  }

  @Get('country-distribution')
  @ApiOperation({ summary: 'country distribution' })
  async getCountryDistribution() {
    return this.profileService.getCountryDistribution();
  }
}
