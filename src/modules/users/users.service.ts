import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entites/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './user.pagination-config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from '../profiles/profiles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profileService: ProfileService,
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
      select: ['id', 'email', 'userType', 'role'],
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const { email, password, userType, ...profileData } = userData;

    const user = this.userRepository.create({
      email,
      password,
      userType,
    });

    const savedUser = await this.userRepository.save(user);
    await this.profileService.create(savedUser.id, profileData);

    return this.findOneOrThrow(savedUser.id);
  }

  update(
    userId: number,
    userInformation: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository.update(userId, userInformation);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
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

  // Add this method if it doesn't exist
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
