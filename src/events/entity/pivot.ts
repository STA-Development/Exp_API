import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne
} from 'typeorm';
import { Event, EventPivotDto } from './event';
import { Criteria, CriteriaPivotDto } from './criteria';
import { IPivot } from '../interface/pivotInterface';
import { Rating, RatingPivotDto } from './rating';
import { SubCriteria, SubCriteriaPivotDto } from './subCriteria';
import { User, UserPivot } from '../../users/entity/user';
import { IPivotGetDto } from '../interface/pivotGetDtoInterface';

@Entity()
export class Pivot implements IPivot {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn()
  eventId: number;

  @PrimaryColumn()
  criteriaId: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  subCriteriaId: number;

  @PrimaryColumn()
  ratingId: number;

  @ManyToOne(() => Criteria, (criteria: Criteria) => criteria.pivot, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  criteria: Criteria;

  @ManyToOne(() => User, (user: User) => user.pivot, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  user: User;

  @ManyToOne(() => Rating, (rating: Rating) => rating.pivot, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  rating: Rating;

  @ManyToOne(
    () => SubCriteria,
    (subCriteria: SubCriteria) => subCriteria.pivot,
    {
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      createForeignKeyConstraints: false
    }
  )
  subCriteria: SubCriteria;

  @ManyToOne(() => Event, (event: Event) => event.pivot, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  event: Event;
}

export class PivotDto implements IPivotGetDto {
  //id: number;
  criteria: CriteriaPivotDto;
  event: EventPivotDto;
  rating: RatingPivotDto;
  subCriteria: SubCriteriaPivotDto;
  user: UserPivot;
}
