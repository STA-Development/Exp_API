import {EventDto} from '../entity/event'
import {UserDto} from '../../users/entity/user'

export interface IEventEvaluatorGetDto {
  event: EventDto
  user: UserDto
}
