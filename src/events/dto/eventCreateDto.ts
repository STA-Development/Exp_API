import {
  IsString,
  IsInt,
  IsEnum,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max
} from 'class-validator';

import { Period } from '../interface/eventInterface';
import { Pivot } from '../entity/pivot';

export class CreateEventDto {
  @IsString()
  readonly title: string;

  @IsInt()
  @Min(0)
  @Max(100)
  readonly bonus: number;

  @IsEnum(Period)
  readonly timePeriod: Period;

  @IsOptional()
  pivot: Pivot[];

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsNumber()
  endsAt: Date;
}
