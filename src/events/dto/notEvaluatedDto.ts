import { ApiProperty } from '@nestjs/swagger';

export class NotEvaluatedDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly lastEvaluated: string;
}
