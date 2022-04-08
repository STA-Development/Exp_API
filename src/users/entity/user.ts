import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany, JoinTable,
} from "typeorm";
import {IUser, PerformerType} from "../interface/userInterface";
import { Event } from "../../events/entity/event";
import {IsString} from "class-validator";
import {Criteria} from "../../events/entity/criteria";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @IsString()
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  rating: number;

  @Column({default: PerformerType.waitingForEvaluation})
  performerType: string;

  @ManyToMany(() => Event, (events) => events.users)
  events: Event[];

  @ManyToMany(() => Criteria, (criteria) => criteria.users)
  @JoinTable({
    name: "user_criteria",
    joinColumn: { name: "criteriaId" },
    inverseJoinColumn: { name: "userId" },
  })
  criteria: Criteria[];


}
