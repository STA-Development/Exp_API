import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { IUser } from "../interface/userInterface";
import { Event } from "../../events/entity/event";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column( {unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 60000 })
  salary: number;

  @Column()
  avatar: string;

  @Column({ default: null})
  avatarPublicId: string;

  @ManyToMany(() => Event, (events) => events.users)
  events: Event[];
}
