import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { IEvent, Period } from "../interface/eventInterface";
import { Pivot, PivotDto } from "./pivot";

@Entity()
export class Event implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  bonus: number;

  @Column()
  TimePeriod: Period;

  @OneToMany(() => Pivot, (pivot) => pivot.event, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    createForeignKeyConstraints: false,
  })
  pivot: Pivot[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  endsAt: Date;
}
export class EventPivotDto {
  id: number;
  title: string;
  bonus: number;
  TimePeriod: Period;
  pivot: PivotDto[];
  createdAt: Date;
  endsAt: Date;
}
