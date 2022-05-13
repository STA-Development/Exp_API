import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min
} from 'class-validator';
import { SubCriteria } from '../entity/subCriteria';
import { DtoLimitations } from '../../enums/dtoLimitations';

export class UpdateSubCriteriaDto extends SubCriteria {
  @ApiPropertyOptional()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty()
  @IsInt()
  @Min(DtoLimitations.subCriteriaPointMin)
  @Max(DtoLimitations.subCriteriaPointMax)
  point: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly criteriaId: number;
}
