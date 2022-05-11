import { User } from '../../users/entity/user';
import { Criteria } from '../entity/criteria';

export enum Period {
  never = 'never',
  monthly = 'monthly',
  quarterly = 'quarterly',
  sixMonths = 'sixMonths',
  annually = 'annually'
}

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
