import { Event, EventPivotDto } from "../entity/event";
import { pivotGetDto } from "./pivotGetDto";

export const eventGetDto = (event: EventPivotDto): EventPivotDto => {
  return {
    id: event.id,
    title: event.title,
    bonus: event.bonus,
    pivot: event?.pivot?.length
      ? event.pivot.map((pivot) => pivotGetDto(pivot))
      : event.pivot,
    TimePeriod: event.TimePeriod,
    createdAt: event.createdAt,
    endsAt: event.endsAt,
  };
};
