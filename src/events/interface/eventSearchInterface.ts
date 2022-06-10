import { Period } from '../../enums/eventPeriod';

export interface IEventSearch {
  title?: string;
  bonus?: number;
  period?: Period;
  date?: Date;
  completedEventTitle?: string;
  completedEventDate?: Date;
}
