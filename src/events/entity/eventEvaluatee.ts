import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Event } from './event';
import { User } from '../../users/entity/user';
import { UserSubCriteria } from './userSubCriteria';
import { IEventParticipant } from '../interface/eventParticipantInterface';

@Entity()
export class EventEvaluatee implements IEventParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  eventId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user: User) => user.events, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  user: User;

  @ManyToOne(() => Event, (event: Event) => event.users, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  event: Event;

  @OneToMany(
    () => UserSubCriteria,
    (userSubCriteria) => userSubCriteria.evaluatee,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      createForeignKeyConstraints: false
    }
  )
  userSubCriteria: UserSubCriteria[];
}
