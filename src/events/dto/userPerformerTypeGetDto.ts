import { ApiProperty } from '@nestjs/swagger';
import { PerformerType } from '../../enums/performerType';

export class UserPerformerTypeGetDto {
  @ApiProperty()
  evaluateeId: number;

  @ApiProperty()
  performerType: PerformerType;
}
