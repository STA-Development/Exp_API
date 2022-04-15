import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ICriteria } from '../interface/criteriaInterface';
import { Pivot, PivotDto } from './pivot';
import { Event } from './event';
import { SubCriteria } from './subCriteria';

@Entity()
export class Criteria implements ICriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  criteria: boolean;

  @Column()
  rating: number;

  @OneToMany(() => Pivot, (pivot) => pivot.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  pivot: Pivot[];

  @ManyToMany(() => Event, (event) => event.criteria, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // createForeignKeyConstraints: false
  })
  events: Event[];

  @ManyToMany(() => SubCriteria, (subCriteria) => subCriteria.criteria, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // createForeignKeyConstraints: false
    cascade: true
  })
  // @JoinTable({
  //   name: 'criteria_subCriteria',
  //   joinColumn: { name: 'subCriteriaId' },
  //   inverseJoinColumn: { name: 'criteriaId' }
  // })
  subCriteria: SubCriteria[];
}

export class CriteriaPivotDto {
  id: number;
  name: string;
  criteria: boolean;
  rating: number;
  pivot: PivotDto[];
}
