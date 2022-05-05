import {PartialType} from '@nestjs/mapped-types'
import {CreateSubCriteriaDto} from './subCriteriaCreateDto'

export class UpdateSubCriteriaDto extends PartialType(CreateSubCriteriaDto) {}
