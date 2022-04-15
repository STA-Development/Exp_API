import { Event, EventPivotDto } from '../entity/event';
import { pivotGetDto } from './pivotGetDto';

export const eventGetDto = (event: Event): EventPivotDto => {
  return {
    id: event.id,
    title: event.title,
    bonus: event.bonus,
    pivot: event?.pivot?.length
      ? event.pivot.map((pivot) => pivotGetDto(pivot))
      : [],
    timePeriod: event.timePeriod,
    createdAt: event.createdAt,
    endsAt: event.endsAt
  };
};
