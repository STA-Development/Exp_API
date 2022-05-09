import {
  IsString,
  IsInt,
  IsEnum,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEmpty,
} from 'class-validator'

import {Period} from '../interface/eventInterface'
import {Rating} from '../entity/rating'

export class CreateEventDto {
  @IsString()
  readonly title: string

  @IsInt()
  @Min(0)
  @Max(100)
  readonly bonus: number

  @IsEnum(Period)
  readonly timePeriod: Period

  @IsDate()
  @IsOptional()
  createdAt: Date

  @IsNumber()
  endsAt: Date

  @IsEmpty()
  rating: Rating[]
}
