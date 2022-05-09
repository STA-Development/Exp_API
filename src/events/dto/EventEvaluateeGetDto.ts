import {eventGetDto} from './eventGetDto'
import {userGetDto} from '../../users/dto/userGetDto'
import {EventEvaluatee, EventEvaluateeGetDto} from '../entity/eventEvaluatee'
;``
export const eventEvaluateeGetDto = (eventEvaluatee: EventEvaluatee): EventEvaluateeGetDto => ({
  event: eventEvaluatee?.event && eventGetDto(eventEvaluatee.event),
  user: eventEvaluatee?.user && userGetDto(eventEvaluatee.user),
})
