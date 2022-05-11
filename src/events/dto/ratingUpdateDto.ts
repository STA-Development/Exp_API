import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class UpdateRatingDto {
  @ApiPropertyOptional()
  @IsInt()
  readonly from: number;

  @ApiProperty()
  @IsInt()
  readonly to: number;

  @ApiProperty()
  @IsBoolean()
  readonly isSelected: boolean;
}
