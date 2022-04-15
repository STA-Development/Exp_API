import { Pivot } from '../../events/entity/pivot';
import {Event} from "../../events/entity/event";

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
  password: string;
  isAdmin: boolean;
  salary: number;
  avatar: string;
  avatarPublicId: string;
  events: Event[];
}
