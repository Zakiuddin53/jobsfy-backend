import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Unemployed {
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
  fieldOfStudy: string;

  @Column()
  university: string;

  @Column()
  lookingFor: string;

  @OneToOne(() => User, (user) => user.unemployed)
  @JoinColumn()
  user: User;
}
