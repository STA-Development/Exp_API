import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubCriteria } from '../entity/subCriteria';
import { DtoLimitations } from '../../enums/dtoLimitations';

export class CreateSubCriteriaDto extends SubCriteria {
  @ApiProperty()
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
