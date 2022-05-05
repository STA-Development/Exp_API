import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import {IEvent, Period} from '../interface/eventInterface'
import {UserSubCriteria} from './userSubCriteria'
import {User, UserDto} from '../../users/entity/user'
import {Rating, RatingDto} from './rating'
import {Criteria, CriteriaDto} from './criteria'
import {EventEvaluator, EventEvaluatorGetDto} from './eventEvaluator'
import {EventEvaluatee, EventEvaluateeGetDto} from './eventEvaluatee'

@Entity()
export class Event implements IEvent {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  bonus: number

  @Column()
  timePeriod: Period

  @ManyToMany(() => Criteria, (criteria) => criteria.events, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinTable({
    name: 'event_criteria',
    joinColumn: {name: 'eventId'},
    inverseJoinColumn: {name: 'criteriaId'},
  })
  criteria: Criteria[]

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
    eager: true,
  })
  userSubCriteria: UserSubCriteria[]

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  endsAt: Date

  @ManyToMany(() => User, (user) => user.events, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'event_user',
    joinColumn: {name: 'eventId'},
    inverseJoinColumn: {name: 'userId'},
  })
  users: User[]

  @ManyToMany(() => Rating, (rating) => rating.events, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinTable({
    name: 'event_rating',
    joinColumn: {name: 'eventId'},
    inverseJoinColumn: {name: 'ratingId'},
  })
  rating: Rating[]

  @OneToMany(() => EventEvaluator, (eventEvaluator) => eventEvaluator.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  eventEvaluator: EventEvaluator[]

  @OneToMany(() => EventEvaluatee, (eventEvaluatee) => eventEvaluatee.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  eventEvaluatee: EventEvaluatee[]
}
export class EventDto {
  id: number

  title: string

  bonus: number

  timePeriod: Period

  users: UserDto[]

  eventEvaluator: EventEvaluatorGetDto[]

  eventEvaluatee: EventEvaluateeGetDto[]

  criteria: CriteriaDto[]

  rating: RatingDto[]

  createdAt: Date

  endsAt: Date
}
