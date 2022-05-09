import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany} from 'typeorm'
import {ISubCriteria} from '../interface/subCriteriaInterface'
import {UserSubCriteria} from './userSubCriteria'
import {Criteria, CriteriaDto} from './criteria'

@Entity()
export class SubCriteria implements ISubCriteria {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  result: boolean

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.subCriteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]

  @ManyToMany(() => Criteria, (criteria) => criteria.subCriteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  criterias: Criteria[]
}

export class SubCriteriaDto {
  id: number

  name: string

  result: boolean

  criterias: CriteriaDto[]
}
