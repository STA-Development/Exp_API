import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IUser, PerformerType } from '../interface/userInterface';
import { IsString } from 'class-validator';
import { Pivot, PivotDto } from '../../events/entity/pivot';
import { Event } from '../../events/entity/event';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
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
  events: Event[];
}

export class UserPivot {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  performerType: string;
  pivot: PivotDto[];
}
