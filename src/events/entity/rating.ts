import {
  Entity,
  Column,
  PrimaryGeneratedColumn, ManyToMany,
} from 'typeorm';
import {IRating} from '../interface/ratingInterface';
import {Event} from './event';

@Entity()
export class Rating implements IRating {
    @PrimaryGeneratedColumn()
      id: number;

    @Column()
      from: number;

    @Column()
      to: number;

    @Column({default: false})
      isSelected: boolean;

    @ManyToMany(() => Event, (event) => event.rating)
      events: Event[];
}
