import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IRating } from '../interface/ratingInterface';
import { UserSubCriteria } from './userSubCriteria';
import { Event, EventDto } from './event';

@Entity()
export class Rating implements IRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column({ default: false })
  isSelected: boolean;

  @OneToMany(
    () => UserSubCriteria,
    (userSubCriteria) => userSubCriteria.rating,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      createForeignKeyConstraints: false
    }
  )
  userSubCriteria: UserSubCriteria[];

  @ManyToMany(() => Event, (event) => event.rating, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  events: Event[];
}

export class RatingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  from: number;

  @ApiProperty()
  to: number;

  @ApiProperty()
  isSelected: boolean;

  events: EventDto[];
}
