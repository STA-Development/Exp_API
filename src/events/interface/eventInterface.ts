import { Pivot } from '../entity/pivot';

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
  pivot: Pivot[];
  timePeriod: Period;
  createdAt: Date;
  //endsAt: Date;
}
