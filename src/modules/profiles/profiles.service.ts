import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entites/profile.entity';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async paginate(query: PaginateQuery) {
    return await paginate(
      query,
      this.profileRepository,
      PROFILE_PAGINATION_CONFIG,
    );
  }

  async findOneOrThrow(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async create(
    userId: number,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const existingProfile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      throw new ForbiddenException('Profile already exists for this user');
    }

    const user = await this.userService.findOneOrThrow(userId);
    const profile = this.profileRepository.create(createProfileDto);
    profile.user = user;

    return this.profileRepository.save(profile);
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOneOrThrow(id);

    // Manually update each property
    profile.firstName = updateProfileDto.firstName ?? profile.firstName;
    profile.lastName = updateProfileDto.lastName ?? profile.lastName;
    profile.gender = updateProfileDto.gender ?? profile.gender;
    profile.country = updateProfileDto.country ?? profile.country;
    profile.state = updateProfileDto.state ?? profile.state;
    profile.city = updateProfileDto.city ?? profile.city;
    profile.industry = updateProfileDto.industry ?? profile.industry;
    profile.companyName = updateProfileDto.companyName ?? profile.companyName;
    profile.level = updateProfileDto.level ?? profile.level;
    profile.department = updateProfileDto.department ?? profile.department;
    profile.title = updateProfileDto.title ?? profile.title;
    profile.fieldOfStudy =
      updateProfileDto.fieldOfStudy ?? profile.fieldOfStudy;
    profile.university = updateProfileDto.university ?? profile.university;
    profile.lookingFor = updateProfileDto.lookingFor ?? profile.lookingFor;

    return this.profileRepository.save(profile);
  }

  private getBaseQuery(userType?: string) {
    let query = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    return query;
  }

  async getLevelDistribution(
    userType?: string,
  ): Promise<{ level: string; percentage: number }[]> {
    let query = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .select('profile.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('profile.level IS NOT NULL');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query.groupBy('profile.level');

    const result = await query.getRawMany();

    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);
    return result.map((item) => ({
      level: item.level || 'Unknown',
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getGenderDistribution(
    userType?: string,
  ): Promise<{ gender: string; percentage: number }[]> {
    let query = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .select('profile.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .where('profile.gender IS NOT NULL');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query.groupBy('profile.gender');

    const result = await query.getRawMany();

    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);
    return result.map((item) => ({
      gender: item.gender,
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getCompanyDistribution(
    userType?: string,
  ): Promise<{ company: string; count: number }[]> {
    let query = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .select('profile.companyName', 'company')
      .addSelect('COUNT(*)', 'count')
      .where('profile.companyName IS NOT NULL');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query
      .groupBy('profile.companyName')
      .orderBy('count', 'DESC')
      .limit(10);

    return query.getRawMany();
  }

  async getDepartementDistribution(
    userType?: string,
  ): Promise<{ department: string; count: number }[]> {
    let query = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .select('profile.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('profile.department IS NOT NULL');

    if (userType) {
      query = query.andWhere('user.userType = :userType', { userType });
    }

    query = query
      .groupBy('profile.department')
      .orderBy('count', 'DESC')
      .limit(10);

    return query.getRawMany();
  }
}
