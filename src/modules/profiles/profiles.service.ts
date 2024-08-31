import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entites/profile.entity';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async paginate(query: PaginateQuery) {
    return await paginate(
      query,
      this.profileRepository,
      PROFILE_PAGINATION_CONFIG,
    );
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    return this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async findOneOrThrow(id: number) {
    return this.profileRepository.findOneOrFail({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async createEmptyProfile(userId: number): Promise<Profile> {
    const emptyProfile = this.profileRepository.create({
      user: { id: userId },
    });
    return this.profileRepository.save(emptyProfile);
  }

  async createOrUpdateProfile(
    userId: number,
    profileDto: CreateProfileDto | UpdateProfileDto,
  ): Promise<Profile> {
    let profile = await this.getProfileByUserId(userId);

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileDto);
    } else {
      // Create new profile
      profile = this.profileRepository.create({
        ...profileDto,
        user: { id: userId },
      });
    }

    return this.profileRepository.save(profile);
  }

  async updateProfile(
    userId: number,
    profileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Only update fields that are provided in the DTO
    Object.keys(profileDto).forEach((key) => {
      if (profileDto[key] !== undefined) {
        profile[key] = profileDto[key];
      }
    });

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
}
