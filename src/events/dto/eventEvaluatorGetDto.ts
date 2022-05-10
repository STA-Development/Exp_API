import {eventGetDto} from './eventGetDto'
import {userGetDto} from '../../users/dto/userGetDto'
import {EventEvaluatorGetDto, EventEvaluator} from '../entity/eventEvaluator'

export const eventEvaluatorGetDto = (eventEvaluator: EventEvaluator): EventEvaluatorGetDto => ({
  event: eventEvaluator?.event && eventGetDto(eventEvaluator.event),
  user: eventEvaluator?.user && userGetDto(eventEvaluator.user),
})
