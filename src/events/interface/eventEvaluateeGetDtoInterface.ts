import { EventDto } from '../entity/event';
import { UserDto } from '../../users/entity/user';

export interface IEventEvaluateeGetDto {
  event: EventDto;
  user: UserDto;
}
