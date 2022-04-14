import {
  IsBoolean,
  IsOptional, IsInt,
} from 'class-validator';
import {Pivot} from '../entity/pivot';

export class CreateRatingDto {
    @IsInt()
  readonly from: number;

    @IsInt()
    readonly to: number;

    @IsBoolean()
    readonly isSelected: number;

    @IsOptional()
      pivot: Pivot[];
}
