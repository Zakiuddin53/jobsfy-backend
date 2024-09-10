import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './user.pagination-config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MuslimCompany } from './entites/muslim-company.entity';
import { Corporate } from './entites/corporate.entity';
import { Unemployed } from './entites/unemployed.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(MuslimCompany)
    private readonly muslimCompanyRepository: Repository<MuslimCompany>,
    @InjectRepository(Unemployed)
    private readonly unemployedRepository: Repository<Unemployed>,
  ) {}

  async paginate(query: PaginateQuery) {
    return await paginate(query, this.userRepository, USER_PAGINATION_CONFIG);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOneOrThrow(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['corporate', 'muslimCompany', 'unemployed'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, userType } = createUserDto;

    const user = this.userRepository.create({
      email,
      password,
      userType,
    });

    const savedUser = await this.userRepository.save(user);

    switch (userType) {
      case 'corporate':
        await this.corporateRepository.save({
          ...createUserDto.corporate,
          user: savedUser,
        });
        break;
      case 'muslim-company':
        await this.muslimCompanyRepository.save({
          ...createUserDto.muslimCompany,
          user: savedUser,
        });
        break;
      case 'unemployed':
        await this.unemployedRepository.save({
          ...createUserDto.unemployed,
          user: savedUser,
        });
        break;
    }

    return this.findOneOrThrow(savedUser.id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrThrow(id);

    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password)
      user.password = await bcrypt.hash(updateUserDto.password, 10);

    switch (user.userType) {
      case 'corporate':
        if (updateUserDto.corporate) {
          await this.corporateRepository.update(
            user.corporate.id,
            updateUserDto.corporate,
          );
        }
        break;
      case 'muslim-company':
        if (updateUserDto.muslimCompany) {
          await this.muslimCompanyRepository.update(
            user.muslimCompany.id,
            updateUserDto.muslimCompany,
          );
        }
        break;
      case 'unemployed':
        if (updateUserDto.unemployed) {
          await this.unemployedRepository.update(
            user.unemployed.id,
            updateUserDto.unemployed,
          );
        }
        break;
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOneOrThrow(id);
    await this.userRepository.remove(user);
  }

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async findOneById(id: number): Promise<User> {
    return this.findOneOrThrow(id);
  }

  async getAllChartData(userType?: string) {
    try {
      const [
        levelDistribution,
        genderDistribution,
        companyDistribution,
        departmentDistribution,
        industryDistribution,
      ] = await Promise.all([
        this.getLevelDistribution(userType),
        this.getGenderDistribution(userType),
        this.getCompanyDistribution(userType),
        this.getDepartmentDistribution(userType),
        this.getIndustryDistribution(userType),
      ]);

      return {
        levelDistribution,
        genderDistribution,
        companyDistribution,
        departmentDistribution,
        industryDistribution,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching chart data: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getLevelDistribution(userType?: string) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.corporate', 'corporate')
      .leftJoinAndSelect('user.muslimCompany', 'muslimCompany')
      .select('COALESCE(corporate.level, muslimCompany.level)', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('corporate.level IS NOT NULL OR muslimCompany.level IS NOT NULL');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query.groupBy('COALESCE(corporate.level, muslimCompany.level)');

    const result = await query.getRawMany();
    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);

    return result.map((item) => ({
      level: item.level || 'Unknown',
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getGenderDistribution(userType?: string) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.corporate', 'corporate')
      .leftJoinAndSelect('user.muslimCompany', 'muslimCompany')
      .leftJoinAndSelect('user.unemployed', 'unemployed')
      .select(
        'COALESCE(corporate.gender, muslimCompany.gender, unemployed.gender)',
        'gender',
      )
      .addSelect('COUNT(*)', 'count')
      .where(
        'corporate.gender IS NOT NULL OR muslimCompany.gender IS NOT NULL OR unemployed.gender IS NOT NULL',
      );

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query.groupBy(
      'COALESCE(corporate.gender, muslimCompany.gender, unemployed.gender)',
    );

    const result = await query.getRawMany();
    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);

    return result.map((item) => ({
      gender: item.gender,
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getCompanyDistribution(userType?: string) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.corporate', 'corporate')
      .leftJoinAndSelect('user.muslimCompany', 'muslimCompany')
      .select(
        'COALESCE(corporate.companyName, muslimCompany.companyName)',
        'company',
      )
      .addSelect('COUNT(*)', 'count')
      .where(
        'corporate.companyName IS NOT NULL OR muslimCompany.companyName IS NOT NULL',
      );

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query
      .groupBy('COALESCE(corporate.companyName, muslimCompany.companyName)')
      .orderBy('count', 'DESC')
      .limit(10);

    return query.getRawMany();
  }

  async getDepartmentDistribution(userType?: string) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.corporate', 'corporate')
      .leftJoinAndSelect('user.muslimCompany', 'muslimCompany')
      .select(
        'COALESCE(corporate.department, muslimCompany.department)',
        'department',
      )
      .addSelect('COUNT(*)', 'count')
      .where(
        'corporate.department IS NOT NULL OR muslimCompany.department IS NOT NULL',
      );

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query
      .groupBy('COALESCE(corporate.department, muslimCompany.department)')
      .orderBy('count', 'DESC')
      .limit(10);

    return query.getRawMany();
  }

  async getIndustryDistribution(userType?: string) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.corporate', 'corporate')
      .leftJoinAndSelect('user.muslimCompany', 'muslimCompany')
      .select(
        'COALESCE(corporate.industry, muslimCompany.industry)',
        'industry',
      )
      .addSelect('COUNT(*)', 'count')
      .where(
        'corporate.industry IS NOT NULL OR muslimCompany.industry IS NOT NULL',
      );

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query.groupBy(
      'COALESCE(corporate.industry, muslimCompany.industry)',
    );

    const result = await query.getRawMany();
    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);

    return result.map((item) => ({
      industry: item.industry,
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }
  async getUnemployedDistribution() {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.unemployed', 'unemployed')
        .where('user.userType = :userType', { userType: 'unemployed' })
        .andWhere('unemployed.id IS NOT NULL');

      const [
        stateDistribution,
        industryDistribution,
        universityDistribution,
        genderDistribution,
      ] = await Promise.all([
        this.getDistribution(query.clone(), 'state'),
        this.getDistribution(query.clone(), 'fieldOfStudy', 'industry'),
        this.getDistribution(query.clone(), 'university'),
        this.getDistribution(query.clone(), 'gender'),
      ]);

      return {
        stateDistribution,
        industryDistribution,
        universityDistribution,
        genderDistribution,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching unemployed distribution: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getDistribution(query: any, field: string, alias?: string) {
    const result = await query
      .select(`unemployed.${field}`, alias || field)
      .addSelect('COUNT(*)', 'count')
      .groupBy(`unemployed.${field}`)
      .getRawMany();

    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);

    return result.map((item) => ({
      [alias || field]: item[alias || field],
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }
}
