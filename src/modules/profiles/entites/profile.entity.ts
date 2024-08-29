import { User } from 'src/modules/users/entites/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  dob: Date;

  @Column({ nullable: true })
  job: string;

  @Column({ nullable: true })
  salary: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  positionLevel: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column({ nullable: true })
  yearsAtCurrentCompany: number;

  @Column({ nullable: true })
  gender: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
