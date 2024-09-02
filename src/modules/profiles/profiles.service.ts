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
    profile.positionLevel =
      updateProfileDto.positionLevel ?? profile.positionLevel;
    profile.salary = updateProfileDto.salary ?? profile.salary;
    profile.division = updateProfileDto.division ?? profile.division;
    profile.dob = updateProfileDto.dob ?? profile.dob;
    profile.address = updateProfileDto.address ?? profile.address;
    profile.job = updateProfileDto.job ?? profile.job;
    profile.yearsOfExperience =
      updateProfileDto.yearsOfExperience ?? profile.yearsOfExperience;
    profile.yearsAtCurrentCompany =
      updateProfileDto.yearsAtCurrentCompany ?? profile.yearsAtCurrentCompany;

    return this.profileRepository.save(profile);
  }

  async getIndustryDistribution(): Promise<
    { industry: string; percentage: number }[]
  > {
    const result = await this.profileRepository
      .createQueryBuilder('profile')
      .select('profile.industry', 'industry')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profile.industry')
      .getRawMany();

    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);
    return result.map((item) => ({
      industry: item.industry || 'Unknown',
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getExperienceOverview(): Promise<
    { yearsOfExperience: number; count: number }[]
  > {
    return this.profileRepository
      .createQueryBuilder('profile')
      .select('profile.yearsOfExperience', 'yearsOfExperience')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profile.yearsOfExperience')
      .orderBy('profile.yearsOfExperience', 'ASC')
      .getRawMany();
  }

  async getLevelDistribution(): Promise<
    { positionLevel: string; percentage: number }[]
  > {
    const result = await this.profileRepository
      .createQueryBuilder('profile')
      .select('profile.positionLevel', 'positionLevel')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profile.positionLevel')
      .getRawMany();

    const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);
    return result.map((item) => ({
      positionLevel: item.positionLevel || 'Unknown',
      percentage: (parseInt(item.count) / total) * 100,
    }));
  }

  async getCountryDistribution(): Promise<
    { country: number; count: number }[]
  > {
    return this.profileRepository
      .createQueryBuilder('profile')
      .select('profile.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('profile.country')
      .orderBy('profile.country', 'ASC')
      .getRawMany();
  }
}
