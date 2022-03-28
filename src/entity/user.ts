import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IUser } from "../interface/userInterface";
import { Event } from "./event";
import {IsString} from "class-validator";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @IsString()
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  email: string;

  @ManyToMany(() => Event, (events) => events.users)
  events: Event[];
}
