import { Profile } from '../../profiles/entites/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({
    type: 'enum',
    enum: ['corporate', 'muslim-company', 'unemployed', 'admin'],
  })
  userType: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
