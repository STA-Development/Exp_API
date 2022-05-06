import {PartialType} from '@nestjs/mapped-types'
import {CreateSubCriteriaDto} from './subCriteriaCreateDto' // todo dto

export class UpdateSubCriteriaDto extends PartialType(CreateSubCriteriaDto) {}
