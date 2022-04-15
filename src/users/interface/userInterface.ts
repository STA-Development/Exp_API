import { Pivot } from '../../events/entity/pivot';

export enum PerformerType {
  rockStar = 'Rock Star',
  goodPotential = 'Good Potential',
  needHelp = 'Need Help',
  waitingForEvaluation = 'Waiting For The Evaluation'
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  performerType: string;
  pivot: Pivot[];
}
