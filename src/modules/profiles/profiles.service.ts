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

  async createOrUpdateProfile(
    userId: number,
    profileDto: CreateProfileDto | UpdateProfileDto,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (profile) {
      // Profile exists, update it
      Object.assign(profile, profileDto);
    } else {
      // Profile doesn't exist, create a new one
      profile = this.profileRepository.create({
        ...profileDto,
        user: { id: userId },
      });
    }

    return this.profileRepository.save(profile);
  }
}
