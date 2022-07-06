import {
  IsString,
  IsInt,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsEmpty,
  IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '../entity/rating';
import { DtoLimitations } from '../../enums/dtoLimitations';
import { Period } from '../../enums/eventPeriod';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsInt()
  @Min(DtoLimitations.eventBonusMin)
  @Max(DtoLimitations.eventBonusMax)
  readonly bonus: number;

  @ApiProperty()
  @IsEnum(Period)
  readonly timePeriod: Period;

  @ApiProperty()
  @IsNumber()
  startsAt: Date;

  @ApiProperty()
  @IsNumber()
  endsAt: Date;

  @ApiProperty()
  @IsEmpty()
  rating: Rating[];

  @ApiProperty()
  @IsArray()
  readonly evaluatorId: number[];

  @ApiProperty()
  @IsArray()
  readonly evaluateeId: number[];

  @ApiProperty()
  @IsInt()
  readonly criteriaId: number;

  @ApiProperty()
  @IsInt()
  readonly ratingId: number;

  @ApiProperty({ type: 'array', items: { type: 'number' } })
  @IsArray()
  subCriteriaIds: number[];

  @ApiProperty()
  @IsInt()
  criteriaSubCriteriaId: number;
}
