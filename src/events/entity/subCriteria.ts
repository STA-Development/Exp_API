import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ISubCriteria } from "../interface/subCriteriaInterface";
import { Pivot, PivotDto } from "./pivot";

@Entity()
export class SubCriteria implements ISubCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  state: boolean;

  @OneToMany(() => Pivot, (pivot) => pivot.subCriteria, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    createForeignKeyConstraints: false,
  })
  pivot: Pivot[];
}

export class SubCriteriaPivotDto {
  id: number;
  name: string;
  state: boolean;
  pivot: PivotDto[];
}
