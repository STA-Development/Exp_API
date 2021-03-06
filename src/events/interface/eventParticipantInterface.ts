import { Event } from '../entity/event';
import { User } from '../../users/entity/user';

export interface IEventParticipant {
  eventId: number;
  userId: number;
  event: Event;
  user: User;
}
