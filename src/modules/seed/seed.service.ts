import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entites/user.entity';
import { Profile } from '../profiles/entites/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async seedAdmin() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Zak81@zaki', 10);
      const adminUser = this.userRepository.create({
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        userType: 'admin',
      });

      await this.userRepository.save(adminUser);

      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists');
    }
  }

  async seed() {
    await this.seedAdmin();
    console.log('Seeding completed');
  }
}
