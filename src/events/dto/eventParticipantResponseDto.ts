import { ApiProperty } from '@nestjs/swagger';
import { IEventParticipantGetDto } from '../interface/eventParticipantGetDtoInterface';
import { EventDto } from '../entity/event';
import { UserDto } from '../../users/entity/user';

export class EventParticipantResponseDto implements IEventParticipantGetDto {
  @ApiProperty()
  event: EventDto;

  @ApiProperty()
  user: UserDto;
}
