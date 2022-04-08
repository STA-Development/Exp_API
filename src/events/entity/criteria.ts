import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { ICriteria } from "../interface/criteriaInterface";
import {Event} from "./event";
import {SubCriteria} from "./subCriteria";
import {User} from "../../users/entity/user";


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

  @ManyToMany(() => Event, (event) => event.criteria)
  events: Event[];

  @OneToMany(() => SubCriteria, (subCriteria) => subCriteria.criteria,{ onDelete: 'CASCADE', onUpdate: 'CASCADE', createForeignKeyConstraints: false})
  subCriteria: SubCriteria[];

  @ManyToMany(() => User, (user) => user.criteria)
  users: User[];


}
