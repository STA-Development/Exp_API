import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { ISubCriteria } from '../interface/subCriteriaInterface';
import { UserSubCriteria } from './userSubCriteria';
import { Criteria, CriteriaDto } from './criteria';

@Entity()
export class SubCriteria implements ISubCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  result: boolean;

  @Column()
  point: number;

  @OneToMany(
    () => UserSubCriteria,
    (userSubCriteria) => userSubCriteria.subCriteria,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      createForeignKeyConstraints: false
    }
  )
  userSubCriteria: UserSubCriteria[];

  @ManyToOne(() => Criteria, (criteria) => criteria.subCriteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false
  })
  criteria: Criteria;
}

export class SubCriteriaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  result: boolean;

  @ApiProperty()
  point: number;

  criteria: CriteriaDto;
}
