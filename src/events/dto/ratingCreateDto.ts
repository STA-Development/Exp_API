import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty()
  @IsInt()
  readonly from: number;

  @ApiProperty()
  @IsInt()
  readonly to: number;

  @ApiProperty()
  @IsBoolean()
  readonly isSelected: boolean;
}
