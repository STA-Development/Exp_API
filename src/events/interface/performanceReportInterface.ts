import { PerformerType } from '../../enums/performerType';

export interface IPerformanceReport {
  eventTitle: string;
  eventStartsAt: Date;
  criteria: string;
  criteriaScore: number;
  performerType: PerformerType;
  evaluatorFirstName: string;
  evaluatorLastName: string;
  evaluatorPosition: string;
  evaluateeFirstName: string;
  evaluateeLastName: string;
  evaluateePosition: string;
}
