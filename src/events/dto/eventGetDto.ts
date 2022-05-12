import { Event, EventDto } from '../entity/event';
import { criteriaGetDto } from './criteriaGetDto';
import { ratingGetDto } from './ratingGetDto';
import { userGetDto } from '../../users/dto/userGetDto';
import { eventParticipantGetDto } from './eventParticipantGetDto';

export const eventGetDto = (event: Event): EventDto => ({
  id: event.id,
  title: event.title,
  bonus: event.bonus,
  users: event?.users && event.users.map((user) => userGetDto(user)),
  eventEvaluator:
    event.eventEvaluator &&
    event.eventEvaluator.map((eventEvaluator) =>
      eventParticipantGetDto(eventEvaluator)
    ),
  eventEvaluatee:
    event.eventEvaluatee &&
    event.eventEvaluatee.map((eventEvaluatee) =>
      eventParticipantGetDto(eventEvaluatee)
    ),
  criteria:
    event.criteria &&
    event.criteria.map((criteria) => criteriaGetDto(criteria)),
  rating: event?.rating && event.rating.map((rating) => ratingGetDto(rating)),
  timePeriod: event.timePeriod,
  createdAt: event.createdAt,
  startsAt: event.startsAt,
  endsAt: event.endsAt
});
