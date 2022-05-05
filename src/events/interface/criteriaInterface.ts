import {SubCriteria} from '../entity/subCriteria'

export interface ICriteria {
  name: string
  criteria: boolean
  subCriteria: SubCriteria[]
}
