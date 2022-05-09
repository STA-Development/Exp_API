import {IsString, IsBoolean} from 'class-validator'
import {SubCriteria} from '../entity/subCriteria'

export class CreateSubCriteriaDto extends SubCriteria {
  @IsString()
  readonly name: string

  @IsBoolean()
  readonly result: boolean
}
