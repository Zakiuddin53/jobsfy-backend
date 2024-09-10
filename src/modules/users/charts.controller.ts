// charts.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UserService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('charts')
@ApiTags('Charts')
@Public()
export class ChartController {
  constructor(private readonly userService: UserService) {}

  @Get('level-distribution')
  @ApiOperation({ summary: 'Get level distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company'],
  })
  async getLevelDistribution(@Query('userType') userType?: string) {
    return this.userService.getLevelDistribution(userType);
  }

  @Get('gender-distribution')
  @ApiOperation({ summary: 'Get gender distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company', 'unemployed'],
  })
  async getGenderDistribution(@Query('userType') userType?: string) {
    return this.userService.getGenderDistribution(userType);
  }

  @Get('company-distribution')
  @ApiOperation({ summary: 'Get company distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company'],
  })
  async getCompanyDistribution(@Query('userType') userType?: string) {
    return this.userService.getCompanyDistribution(userType);
  }

  @Get('department-distribution')
  @ApiOperation({ summary: 'Get department distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company'],
  })
  async getDepartmentDistribution(@Query('userType') userType?: string) {
    return this.userService.getDepartmentDistribution(userType);
  }

  @Get('industry-distribution')
  @ApiOperation({ summary: 'Get industry distribution' })
  @ApiQuery({
    name: 'userType',
    required: false,
    enum: ['corporate', 'muslim-company'],
  })
  async getIndustryDistribution(@Query('userType') userType?: string) {
    return this.userService.getIndustryDistribution(userType);
  }

  @Get('unemployed-distribution')
  @ApiOperation({ summary: 'Get unemployed distribution' })
  async getUnemployedDistribution() {
    return this.userService.getUnemployedDistribution();
  }
}
