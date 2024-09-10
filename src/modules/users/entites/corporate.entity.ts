import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Corporate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  industry: string;

  @Column()
  companyName: string;

  @Column()
  level: string;

  @Column()
  department: string;

  @Column()
  title: string;

  @OneToOne(() => User, (user) => user.corporate)
  @JoinColumn()
  user: User;
}
