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
  state: boolean;

  @ManyToOne(() => Criteria, (criteria) => criteria.subCriteria , {eager:true,createForeignKeyConstraints: false, cascade: true})
  criteria: Criteria;

}
