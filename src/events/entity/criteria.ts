import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ICriteria } from "../interface/criteriaInterface";
import { Pivot, PivotDto } from "./pivot";

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

  @OneToMany(() => Pivot, (pivot) => pivot.criteria, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    createForeignKeyConstraints: false,
  })
  pivot: Pivot[];
}

export class CriteriaPivotDto {
  id: number;
  name: string;
  criteria: boolean;
  rating: number;
  pivot: PivotDto[];
}
