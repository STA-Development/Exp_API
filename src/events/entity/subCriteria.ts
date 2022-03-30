import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { ISubCriteria } from "../interface/subCriteriaInterface";
import {Criteria} from "./criteria";


@Entity()
export class SubCriteria implements ISubCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subCriteria: boolean;

  @ManyToOne(() => Criteria, (criteria) => criteria.subCriteria , { createForeignKeyConstraints: false, onDelete: 'CASCADE' , cascade: true })
  criteria: Criteria;

}
