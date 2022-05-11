import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IUser, PerformerType } from '../interface/userInterface';
import { Event, EventDto } from '../../events/entity/event';
import {
  UserSubCriteria,
  UserSubCriteriaDto
} from '../../events/entity/userSubCriteria';
import { EventEvaluator } from '../../events/entity/eventEvaluator';
import { EventEvaluatee } from '../../events/entity/eventEvaluatee';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: PerformerType.waitingForEvaluation })
  performerType: PerformerType;

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  userSubCriteria: UserSubCriteria[];

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

  @Column({ default: null })
  position: string;

  @ManyToMany(() => Event, (events) => events.users, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  events: Event[];

  @OneToMany(() => EventEvaluator, (eventEvaluator) => eventEvaluator.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  eventEvaluator: EventEvaluator[];

  @OneToMany(() => EventEvaluatee, (eventEvaluatee) => eventEvaluatee.event, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  eventEvaluatee: EventEvaluatee[];
}

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  authUid: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  avatarPublicId: string;

  @ApiProperty()
  performerType: PerformerType;

  userSubCriteria: UserSubCriteriaDto[];

  events: EventDto[];
}
