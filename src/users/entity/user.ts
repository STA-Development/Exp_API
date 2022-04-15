import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany
} from 'typeorm';
import { IUser, PerformerType } from '../interface/userInterface';
import { Event } from '../../events/entity/event';
import { Pivot, PivotDto } from '../../events/entity/pivot';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  rating: number;

  @Column({ default: PerformerType.waitingForEvaluation })
  performerType: string;

  @OneToMany(() => Pivot, (pivot) => pivot.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  pivot: Pivot[];

  @OneToMany(() => Event, (event) => event.users, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  @Column()
  authUid: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 60000 })
  salary: number;

  @Column()
  avatar: string;

  @Column({ default: null })
  avatarPublicId: string;

  @ManyToMany(() => Event, (events) => events.users)
  events: Event[];
}

export class UserPivot {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  authUid: string;
  salary: number;
  rating: number;
  avatar: string;
  avatarPublicId: string;
  performerType: string;
  pivot: PivotDto[];
  events: Event[];
}
