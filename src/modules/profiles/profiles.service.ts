import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entites/profile.entity';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PROFILE_PAGINATION_CONFIG } from './profile.pagination-config';

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
}
