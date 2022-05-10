import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany} from 'typeorm'
import {IUser, PerformerType} from '../interface/userInterface'
import {Event, EventDto} from '../../events/entity/event'
import {UserSubCriteria, UserSubCriteriaDto} from '../../events/entity/userSubCriteria'
import {EventEvaluator} from '../../events/entity/eventEvaluator'
import {EventEvaluatee} from '../../events/entity/eventEvaluatee'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({unique: true})
  email: string

  @Column({default: 0})
  rating: number

  @Column({default: PerformerType.waitingForEvaluation})
  performerType: PerformerType

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]

  @Column({default: null})
  authUid: string

  @Column({default: false})
  isAdmin: boolean

  @Column({default: 60000})
  salary: number

  @Column()
  avatar: string

  @Column({default: null})
  avatarPublicId: string

  @Column({default: null})
  position: string

  @ManyToMany(() => Event, (events) => events.users)
  events: Event[]

  @OneToMany(() => EventEvaluator, (eventEvaluator) => eventEvaluator.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  eventEvaluator: EventEvaluator[]

  @OneToMany(() => EventEvaluatee, (eventEvaluatee) => eventEvaluatee.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  eventEvaluatee: EventEvaluatee[]
}

export class UserDto {
  id: number

  firstName: string

  lastName: string

  email: string

  isAdmin: boolean

  authUid: string

  salary: number

  rating: number

  avatar: string

  position: string

  avatarPublicId: string

  performerType: string

  userSubCriteria: UserSubCriteriaDto[]

  events: EventDto[]
}
