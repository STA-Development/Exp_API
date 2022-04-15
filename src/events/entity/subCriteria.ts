import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ISubCriteria } from '../interface/subCriteriaInterface';
import { Pivot, PivotDto } from './pivot';
import { Event } from './event';
import { Criteria } from './criteria';

@Entity()
export class SubCriteria implements ISubCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  result: boolean;

  @OneToMany(() => Pivot, (pivot) => pivot.subCriteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  pivot: Pivot[];

  @ManyToMany(() => Criteria, (criteria) => criteria.subCriteria, {
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // createForeignKeyConstraints: false
  })
  criteria: Criteria[];
}

export class SubCriteriaPivotDto {
  id: number;
  name: string;
  result: boolean;
  pivot: PivotDto[];
}
