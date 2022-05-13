import { eventGetDto } from './eventGetDto';
import { userGetDto } from '../../users/dto/userGetDto';
import { EventEvaluatee } from '../entity/eventEvaluatee';
import { EventParticipantResponseDto } from './eventParticipantResponseDto';

export const eventParticipantGetDto = (
  eventEvaluatee: EventEvaluatee
): EventParticipantResponseDto => ({
  event: eventEvaluatee?.event && eventGetDto(eventEvaluatee.event),
  user: eventEvaluatee?.user && userGetDto(eventEvaluatee.user)
});
