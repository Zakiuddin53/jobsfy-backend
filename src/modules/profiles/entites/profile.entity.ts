import { User } from '../../users/entites/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  fieldOfStudy: string;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  lookingFor: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
