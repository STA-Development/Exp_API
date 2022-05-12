import { User } from '../../users/entity/user';
import { Criteria } from '../entity/criteria';
import { Period } from '../../enums/eventPeriod';

export interface IEvent {
  id: number;
  title: string;
  bonus: number;
  users: User[];
  criteria: Criteria[];
  timePeriod: Period;
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
}
