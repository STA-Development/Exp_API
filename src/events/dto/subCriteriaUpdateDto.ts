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

export class UpdateSubCriteriaDto extends SubCriteria {
  @ApiPropertyOptional()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsBoolean()
  readonly result: boolean;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(10)
  point: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly criteriaId: number;
}
