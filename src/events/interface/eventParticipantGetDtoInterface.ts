import { EventDto } from '../entity/event';
import { UserDto } from '../../users/entity/user';

export interface IEventParticipantGetDto {
  event: EventDto;
  user: UserDto;
}
