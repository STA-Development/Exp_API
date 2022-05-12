import { IsInt, IsEnum, IsNumber, Min, Max, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '../entity/rating';
import { DtoLimitations } from '../../enums/dtoLimitations';
import { Period } from '../../enums/eventPeriod';

export class UpdateEventDto {
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
}
