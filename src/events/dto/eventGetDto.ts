import { Event, EventDto } from '../entity/event';
import { criteriaGetDto } from './criteriaGetDto';
import { ratingGetDto } from './ratingGetDto';
import { userGetDto } from '../../users/dto/userGetDto';
import { eventEvaluatorGetDto } from './eventEvaluatorGetDto';

export const eventGetDto = (event: Event): EventDto => ({
  id: event.id,
  title: event.title,
  bonus: event.bonus,
  users: event?.users && event.users.map((user) => userGetDto(user)),
  eventEvaluator:
    event.eventEvaluator &&
    event.eventEvaluator.map((eventEvaluator) =>
      eventEvaluatorGetDto(eventEvaluator)
    ),
  eventEvaluatee:
    event.eventEvaluatee &&
    event.eventEvaluatee.map((eventEvaluatee) =>
      eventEvaluatorGetDto(eventEvaluatee)
    ),
  criteria:
    event.criteria &&
    event.criteria.map((criteria) => criteriaGetDto(criteria)),
  rating: event?.rating && event.rating.map((rating) => ratingGetDto(rating)),
  timePeriod: event.timePeriod,
  createdAt: event.createdAt,
  endsAt: event.endsAt
});
