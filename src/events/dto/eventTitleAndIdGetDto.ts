import { Event, EventTitleAndIdDto } from '../entity/event';

export const eventTitleAndIdGetDto = (event: Event): EventTitleAndIdDto => ({
  id: event.id,
  title: event.title,
});
