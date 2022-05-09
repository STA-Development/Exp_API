import {Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne} from 'typeorm'
import {Event, EventDto} from './event'
import {User, UserDto} from '../../users/entity/user'
import {IEventEvaluator} from '../interface/eventEvaluatorInterface'
import {IEventEvaluatorGetDto} from '../interface/eventEvaluatorGetDtoInterface'

@Entity()
export class EventEvaluator implements IEventEvaluator {
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

export class EventEvaluatorGetDto implements IEventEvaluatorGetDto {
  event: EventDto

  user: UserDto
}
