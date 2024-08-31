import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entites/profile.entity';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { ChartController } from './charts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController, ChartController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
