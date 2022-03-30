import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IEvent, Period } from "../interface/eventInterface";
import { User } from "../../users/entity/user";
import {Criteria} from "./criteria";

@Entity()
export class Event implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  bonus: number;

  @Column()
  rating: number;

  @Column()
  TimePeriod: Period;

  @ManyToMany(() => User, (users) => users.events)
  @JoinTable({
    name: "event_user",
    joinColumn: { name: "userId" },
    inverseJoinColumn: { name: "eventId" },
  })
  users: User[];

  @ManyToMany(() => Criteria, (criteria) => criteria.events, {cascade: true})
  @JoinTable({
    name: "event_criteria",
    joinColumn: { name: "criteriaId" },
    inverseJoinColumn: { name: "eventId" },
  })
  criteria: Criteria[];

  @CreateDateColumn({ type: "timestamp" } )
  createdAt: Date;
  //
  // @Column({ type: "timestamp" })
  // endsAt: Date;

}
