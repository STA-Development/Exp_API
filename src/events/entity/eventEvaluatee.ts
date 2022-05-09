import {Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne} from 'typeorm'
import {Event, EventDto} from './event'
import {User, UserDto} from '../../users/entity/user'
import {IEventEvaluatee} from '../interface/eventEvaluateeInterface'
import {IEventEvaluateeGetDto} from '../interface/eventEvaluateeGetDtoInterface'

@Entity()
export class EventEvaluatee implements IEventEvaluatee {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn()
  eventId: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => User, (user: User) => user.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  user: User

  @ManyToOne(() => Event, (event: Event) => event.userSubCriteria, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  event: Event
}

export class EventEvaluateeGetDto implements IEventEvaluateeGetDto {
  event: EventDto

  user: UserDto
}
