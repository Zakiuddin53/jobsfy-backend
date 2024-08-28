import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entites/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './user.pagination-config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async paginate(query: PaginateQuery) {
    return await paginate(query, this.userRepository, USER_PAGINATION_CONFIG);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async create(user: Omit<User, 'id' | 'profile'>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  update(
    userId: number,
    userInformation: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository.update(userId, userInformation);
  }
}
