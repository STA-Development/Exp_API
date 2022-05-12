import * as dayjs from 'dayjs';
import { Event } from '../events/entity/event';

export const isUpcomingEvent = (event: Event): boolean =>
  dayjs().isBefore(event.startsAt);
