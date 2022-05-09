import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable} from 'typeorm'
import {ICriteria} from '../interface/criteriaInterface'
import {UserSubCriteria} from './userSubCriteria'
import {Event} from './event'
import {SubCriteria, SubCriteriaDto} from './subCriteria'

@Entity()
export class Criteria implements ICriteria {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  criteria: boolean

  @Column()
  rating: number

  @OneToMany(() => UserSubCriteria, (userSubCriteria) => userSubCriteria.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  userSubCriteria: UserSubCriteria[]

  @ManyToMany(() => Event, (event) => event.criteria, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  events: Event[]

  @ManyToMany(() => SubCriteria, (subCriteria) => subCriteria.criterias, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'criteria_subcriteria',
    joinColumn: {name: 'subCriteriaId'},
    inverseJoinColumn: {name: 'criteriaId'},
  })
  subCriteria: SubCriteria[]
}

export class CriteriaDto {
  id: number

  name: string

  criteria: boolean

  rating: number

  subCriteria: SubCriteriaDto[]
}
