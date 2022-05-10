import {Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, OneToMany} from 'typeorm'
import {ApiProperty} from '@nestjs/swagger'
import {Event, EventDto} from './event'
import {User, UserDto} from '../../users/entity/user'
import {IEventEvaluator} from '../interface/eventEvaluatorInterface'
import {IEventEvaluatorGetDto} from '../interface/eventEvaluatorGetDtoInterface'
import {UserSubCriteria} from './userSubCriteria'

@Entity()
export class EventEvaluator implements IEventEvaluator {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn()
  eventId: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => User, (user: User) => user.events, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  user: User

  @ManyToOne(() => Event, (event: Event) => event.users, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  event: Event

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.evaluator, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]
}

export class EventEvaluatorGetDto implements IEventEvaluatorGetDto {
  @ApiProperty()
  event: EventDto

  @ApiProperty()
  user: UserDto
}
