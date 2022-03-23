import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IEvent, Period } from "../interface/eventInterface";
import { User } from "./user";

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

  @CreateDateColumn({ type: "timestamp" } )
  createdAt: Date;

  @Column({ type: "timestamp" })
  endsAt: Date;

  // @Column()
  // criteria: [];
}
