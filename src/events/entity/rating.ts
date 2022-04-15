import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { IRating } from '../interface/ratingInterface';
import { Pivot, PivotDto } from './pivot';
import { Event } from './event';

@Entity()
export class Rating implements IRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column({ default: false })
  isSelected: number;

  @OneToMany(() => Pivot, (pivot) => pivot.rating, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  pivot: Pivot[];

  @ManyToMany(() => Event, (event) => event.rating, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  events: Event[];
}

export class RatingPivotDto {
  id: number;
  from: number;
  to: number;
  isSelected: number;
  pivot: PivotDto[];
}
