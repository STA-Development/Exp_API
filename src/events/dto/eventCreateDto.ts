import {IsString, IsInt, IsEnum, IsNumber, Min, Max, IsEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import {Period} from '../interface/eventInterface'
import {Rating} from '../entity/rating'

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  readonly title: string

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly bonus: number

  @ApiProperty()
  @IsEnum(Period)
  readonly timePeriod: Period

  @ApiProperty()
  @IsNumber()
  endsAt: Date

  @ApiProperty()
  @IsEmpty()
  rating: Rating[]
}
