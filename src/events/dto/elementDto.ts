import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ElementDto {
  @ApiProperty()
  @IsInt()
  readonly id: number;
}
