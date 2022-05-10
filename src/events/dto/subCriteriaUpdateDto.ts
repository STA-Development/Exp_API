import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {IsBoolean, IsNotEmpty, IsString} from 'class-validator'
import {SubCriteria} from '../entity/subCriteria'

export class UpdateSubCriteriaDto extends SubCriteria {
  @ApiPropertyOptional()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsBoolean()
  readonly result: boolean

  @ApiProperty()
  @IsNotEmpty()
  readonly criteriaId: number
}
