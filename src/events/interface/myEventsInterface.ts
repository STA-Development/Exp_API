import { EventStatus } from '../../enums/eventStatus';

export interface IMyEvents {
  status: EventStatus;
  title: string;
  startsAt: Date;
}
