import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany, JoinColumn,
} from "typeorm";
import { ICriteria } from "../interface/criteriaInterface";
import {Event} from "./event";
import {SubCriteria} from "./subCriteria";


@Entity()
export class Criteria implements ICriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  criteria: boolean;

  @ManyToMany(() => Event, (event) => event.criteria)
  events: Event[];

  @OneToMany(() => SubCriteria, (subCriteria) => subCriteria.criteria,{ createForeignKeyConstraints: false, onUpdate: "CASCADE" })
  @JoinColumn({ name: "subCriteriaId" })
  subCriteria: SubCriteria[];
}
