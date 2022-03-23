import { Timestamp } from "typeorm";
import { User } from "../entity/user";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";

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
  rating: number;
  TimePeriod: Period;
  users: User[];
  createdAt: Date;
  endsAt: Date;
  // criteria: [];
}
