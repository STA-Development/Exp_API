import {Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, OneToMany} from 'typeorm'
import {Event, EventDto} from './event'
import {User, UserDto} from '../../users/entity/user'
import {IEventEvaluatee} from '../interface/eventEvaluateeInterface'
import {IEventEvaluateeGetDto} from '../interface/eventEvaluateeGetDtoInterface'
import {UserSubCriteria} from './userSubCriteria'

@Entity()
export class EventEvaluatee implements IEventEvaluatee {
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

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.evaluatee, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]
}

export class EventEvaluateeGetDto implements IEventEvaluateeGetDto {
  event: EventDto

  user: UserDto
}
