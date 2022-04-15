import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { IEvent, Period } from '../interface/eventInterface';
import { Pivot, PivotDto } from './pivot';
import { User } from '../../users/entity/user';
import { Rating } from './rating';
import { Criteria } from './criteria';
import { SubCriteria } from './subCriteria';

@Entity()
export class Event implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  bonus: number;

  @Column()
  timePeriod: Period;

  @OneToMany(() => Pivot, (pivot) => pivot.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true
  })
  pivot: Pivot[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  endsAt: Date;

  @ManyToMany(() => User, (user) => user.events, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    //createForeignKeyConstraints: false
    cascade: true
  })
  @JoinTable({
    name: 'event_user',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'eventId' }
  })
  users: User[];

  @ManyToMany(() => Rating, (rating) => rating.events, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    //createForeignKeyConstraints: false
    cascade: true
  })
  @JoinTable({
    name: 'event_rating',
    joinColumn: { name: 'ratingId' },
    inverseJoinColumn: { name: 'eventId' }
  })
  rating: Rating[];

  @ManyToMany(() => Criteria, (criteria) => criteria.events, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // createForeignKeyConstraints: false
    cascade: true
  })
  @JoinTable({
    name: 'event_criteria',
    joinColumn: { name: 'criteriaId' },
    inverseJoinColumn: { name: 'eventId' }
  })
  criteria: Criteria[];
}
export class EventPivotDto {
  id: number;
  title: string;
  bonus: number;
  timePeriod: Period;
  pivot: PivotDto[];
  createdAt: Date;
  endsAt: Date;
}
