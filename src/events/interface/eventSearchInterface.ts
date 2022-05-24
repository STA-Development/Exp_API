import { Period } from '../../enums/eventPeriod';

export interface IEventSearch {
  title?: string;
  bonus?: number;
  period?: Period;
}
