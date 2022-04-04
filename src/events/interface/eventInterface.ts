import { User } from "../../users/entity/user";
import { SubCriteria } from "../entity/subCriteria";
import {Criteria} from "../entity/criteria";
import {Rating} from "../entity/rating";

export enum Period {
  never = "never",
  monthly = "monthly",
  quarterly = "quarterly",
  sixMonths = "sixMonths",
  annually = "annually",
}

export interface IEvent {
  id: number;
  title: string;
  bonus: number;
  rating: Rating[];
  TimePeriod: Period;
  users: User[];
  criteria: Criteria[];
  createdAt: Date;
  endsAt: Date;
}
