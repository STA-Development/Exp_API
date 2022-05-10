import {IsString, IsBoolean, IsNotEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import {SubCriteria} from '../entity/subCriteria'

export class CreateSubCriteriaDto extends SubCriteria {
  @ApiProperty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsBoolean()
  readonly result: boolean

  @ApiProperty()
  @IsNotEmpty()
  readonly criteriaId: number
}
