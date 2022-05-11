import { ApiProperty } from '@nestjs/swagger';

export class ElementDto {
  @ApiProperty()
  readonly id: number;
}
