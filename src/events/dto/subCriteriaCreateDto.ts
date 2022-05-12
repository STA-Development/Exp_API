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

export class CreateSubCriteriaDto extends SubCriteria {
  @ApiProperty()
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
